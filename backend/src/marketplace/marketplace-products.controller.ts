import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MarketplaceService } from './marketplace.service';

@ApiBearerAuth()
@ApiTags('Marketplace')
@Controller('products')
export class ProductsController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  list(@Query('q') q?: string, @Query('take') take = 20, @Query('skip') skip = 0) {
    return this.marketplaceService.listProducts({ q, take: Number(take), skip: Number(skip) });
  }

  @Post()
  @Roles(RoleName.VENDOR, RoleName.ADMIN, RoleName.SUPER_ADMIN)
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateProductDto) {
    return this.marketplaceService.createProduct(user.id, dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.marketplaceService.getProduct(id);
  }

  @Patch(':id')
  @Roles(RoleName.VENDOR, RoleName.ADMIN, RoleName.SUPER_ADMIN)
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.marketplaceService.updateProduct(user.id, id, dto);
  }
}
