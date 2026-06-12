import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { MarketplaceService } from './marketplace.service';

@ApiBearerAuth()
@ApiTags('Marketplace')
@Controller('vendor')
export class VendorController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('dashboard')
  @Roles(RoleName.VENDOR, RoleName.ADMIN, RoleName.SUPER_ADMIN)
  dashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.marketplaceService.vendorDashboard(user.id);
  }
}
