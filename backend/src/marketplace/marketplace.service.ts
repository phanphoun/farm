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

  async listProducts(input: { q?: string; take?: number; skip?: number }) {
    if (input.q) {
      const result = await this.search.search('products', input.q, {
        limit: Math.min(input.take ?? 20, 50),
        offset: input.skip ?? 0
      });
      return result.hits;
    }

    return this.prisma.product.findMany({
      where: { status: ProductStatus.ACTIVE },
      take: Math.min(input.take ?? 20, 50),
      skip: input.skip ?? 0,
      orderBy: { createdAt: 'desc' },
      include: {
        vendor: { select: { id: true, displayName: true, avatarUrl: true } },
        category: true
      }
    });
  }

  async createProduct(vendorId: string, dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        vendorId,
        categoryId: dto.categoryId,
        name: dto.name,
        slug: `${this.slugify(dto.name)}-${Date.now().toString(36)}`,
        description: dto.description,
        price: dto.price,
        currency: dto.currency ?? 'KHR',
        stockQuantity: dto.stockQuantity ?? 0,
        unit: dto.unit,
        images: dto.images ?? [],
        tags: dto.tags ?? [],
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
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.vendorId !== vendorId) throw new ForbiddenException('Only the vendor can update product');

    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true }
    });
  }

  async getCart(userId: string) {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
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
          shippingAddress: dto.shippingAddress ?? {},
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              vendorId: item.product.vendorId,
              quantity: item.quantity,
              unitPrice: item.product.price,
              total: item.product.price.mul(item.quantity),
              snapshot: {
                name: item.product.name,
                unit: item.product.unit,
                images: item.product.images
              }
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
    const [products, orderItems] = await Promise.all([
      this.prisma.product.count({ where: { vendorId } }),
      this.prisma.orderItem.findMany({ where: { vendorId }, include: { order: true } })
    ]);

    const grossSales = orderItems
      .filter((item) => ['PAID', 'FULFILLING', 'SHIPPED', 'DELIVERED'].includes(item.order.status))
      .reduce((sum, item) => sum.add(item.total), new Prisma.Decimal(0));

    return {
      products,
      orderItems: orderItems.length,
      grossSales
    };
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
