import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { CreateOrderDto } from './dto/create-order.dto';
import { MockPaymentDto } from './dto/mock-payment.dto';
import { MarketplaceService } from './marketplace.service';

@ApiBearerAuth()
@ApiTags('Marketplace')
@Controller('orders')
export class OrdersController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateOrderDto) {
    return this.marketplaceService.createOrderFromCart(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.marketplaceService.listOrders(user.id);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.marketplaceService.getOrder(user.id, id);
  }

  @Post(':id/payments/mock')
  mockPayment(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: MockPaymentDto) {
    return this.marketplaceService.mockPayment(user.id, id, dto);
  }
}
