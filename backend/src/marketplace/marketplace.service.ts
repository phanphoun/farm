import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma, ProductStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from '../search/search.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { MockPaymentDto } from './dto/mock-payment.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly search: SearchService
  ) {}

  async listProducts(input: { q?: string; category?: string; page?: number; limit?: number }) {
    const take = Math.min(input.limit ?? 20, 50);
    const page = Math.max(input.page ?? 1, 1);
    const skip = (page - 1) * take;

    if (input.q) {
      const result = await this.search.search('products', input.q, { limit: take, offset: skip });
      const hits = result.hits as unknown[];
      return { data: hits, total: hits.length, page };
    }

    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.ACTIVE,
      ...(input.category
        ? { category: { name: { contains: input.category, mode: 'insensitive' } } }
        : {})
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: { select: { id: true, displayName: true, avatarUrl: true } },
          category: true
        }
      }),
      this.prisma.product.count({ where })
    ]);

    return { data: products, total, page };
  }

  async createProduct(vendorId: string, dto: CreateProductDto) {
    const category = dto.categoryId
      ? await this.prisma.productCategory.findUnique({ where: { id: dto.categoryId } })
      : null;

    const product = await this.prisma.product.create({
      data: {
        vendorId,
        categoryId: category?.id ?? null,
        name: dto.name,
        slug: `${this.slugify(dto.name)}-${Date.now().toString(36)}`,
        description: dto.description,
        price: dto.price,
        currency: dto.currency ?? 'KHR',
        stockQuantity: dto.stockQuantity ?? 0,
        unit: dto.unit,
        images: (dto.images ?? []) as Prisma.InputJsonValue,
        tags: (dto.tags ?? []) as Prisma.InputJsonValue,
        status: dto.status ?? ProductStatus.ACTIVE
      },
      include: { category: true }
    });

    await this.search.indexDocument('products', {
      id: product.id,
      name: product.name,
      description: product.description,
      tags: product.tags,
      price: product.price,
      currency: product.currency,
      status: product.status
    });

    return product;
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        vendor: { select: { id: true, displayName: true, avatarUrl: true } },
        category: true,
        reviews: { take: 10, orderBy: { createdAt: 'desc' } }
      }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(vendorId: string, id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');
    if (existing.vendorId !== vendorId)
      throw new ForbiddenException('Only the vendor can update this product');

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.currency !== undefined && { currency: dto.currency }),
        ...(dto.stockQuantity !== undefined && { stockQuantity: dto.stockQuantity }),
        ...(dto.unit !== undefined && { unit: dto.unit }),
        ...(dto.images !== undefined && { images: dto.images as Prisma.InputJsonValue }),
        ...(dto.tags !== undefined && { tags: dto.tags as Prisma.InputJsonValue }),
        ...(dto.status !== undefined && { status: dto.status })
      },
      include: { category: true }
    });
  }

  async getCart(userId: string) {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: { items: { include: { product: true } } }
    });

    return {
      ...cart,
      totalAmount: cart.items.reduce(
        (sum, item) => sum.add(item.product.price.mul(item.quantity)),
        new Prisma.Decimal(0)
      )
    };
  }

  async addCartItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });

    return this.prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: dto.productId } },
      update: { quantity: { increment: dto.quantity } },
      create: { cartId: cart.id, productId: dto.productId, quantity: dto.quantity },
      include: { product: true }
    });
  }

  async createOrderFromCart(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });

    if (!cart?.items.length) throw new BadRequestException('Cart is empty');

    const subtotal = cart.items.reduce(
      (sum, item) => sum.add(item.product.price.mul(item.quantity)),
      new Prisma.Decimal(0)
    );

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          buyerId: userId,
          status: OrderStatus.CONFIRMED,
          subtotalAmount: subtotal,
          totalAmount: subtotal,
          shippingAddress: (dto.shippingAddress ?? {}) as Prisma.InputJsonValue,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              vendorId: item.product.vendorId,
              quantity: item.quantity,
              unit: item.product.unit,
              unitPrice: item.product.price,
              total: item.product.price.mul(item.quantity),
              snapshot: {
                name: item.product.name,
                unit: item.product.unit,
                images: item.product.images
              } as Prisma.InputJsonValue
            }))
          }
        },
        include: { items: true }
      });

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return order;
    });
  }

  listOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: 'desc' },
      include: { items: true, payments: true }
    });
  }

  async getOrder(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, buyerId: userId },
      include: { items: true, payments: true }
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async mockPayment(userId: string, orderId: string, dto: MockPaymentDto) {
    const order = await this.prisma.order.findFirst({ where: { id: orderId, buyerId: userId } });
    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          orderId,
          provider: dto.provider ?? 'mock',
          status: 'PAID',
          amount: order.totalAmount,
          currency: order.currency,
          providerRef: `mock_${Date.now()}`
        }
      });
      await tx.order.update({ where: { id: orderId }, data: { status: 'PAID' } });
      return payment;
    });
  }

  async vendorDashboard(vendorId: string) {
    const [productCount, orderItems] = await Promise.all([
      this.prisma.product.count({ where: { vendorId } }),
      this.prisma.orderItem.findMany({ where: { vendorId }, include: { order: true } })
    ]);

    const revenue = orderItems.reduce(
      (sum, item) => sum.add(item.total),
      new Prisma.Decimal(0)
    );

    return { productCount, orderCount: orderItems.length, revenue };
  }

  private slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .trim();
  }
}
