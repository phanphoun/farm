import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { MarketplaceService } from './marketplace.service';

@ApiBearerAuth()
@ApiTags('Marketplace')
@Controller('cart')
export class CartController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  get(@CurrentUser() user: AuthenticatedUser) {
    return this.marketplaceService.getCart(user.id);
  }

  @Post('items')
  addItem(@CurrentUser() user: AuthenticatedUser, @Body() dto: AddCartItemDto) {
    return this.marketplaceService.addCartItem(user.id, dto);
  }
}
