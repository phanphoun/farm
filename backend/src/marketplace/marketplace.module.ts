import { Module } from '@nestjs/common';
import { CartController } from './marketplace-cart.controller';
import { OrdersController } from './marketplace-orders.controller';
import { ProductsController } from './marketplace-products.controller';
import { VendorController } from './marketplace-vendor.controller';
import { MarketplaceService } from './marketplace.service';

@Module({
  controllers: [ProductsController, CartController, OrdersController, VendorController],
  providers: [MarketplaceService],
  exports: [MarketplaceService]
})
export class MarketplaceModule {}
