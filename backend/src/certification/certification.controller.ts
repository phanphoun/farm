import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { CertificationService } from './certification.service';
import { CreateCertificationApplicationDto } from './dto/create-certification-application.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';

@ApiBearerAuth()
@ApiTags('Certification')
@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Get('types')
  types() {
    return this.certificationService.types();
  }

  @Post('applications')
  createApplication(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCertificationApplicationDto
  ) {
    return this.certificationService.createApplication(user.id, dto);
  }

  @Get('applications')
  applications(@CurrentUser() user: AuthenticatedUser) {
    return this.certificationService.applications(user);
  }

  @Post('applications/:id/inspections')
  @Roles(RoleName.ADMIN, RoleName.GOV, RoleName.NGO, RoleName.SUPER_ADMIN)
  createInspection(@Param('id') id: string, @Body() dto: CreateInspectionDto) {
    return this.certificationService.createInspection(id, dto);
  }

  @Post('applications/:id/issue')
  @Roles(RoleName.ADMIN, RoleName.GOV, RoleName.SUPER_ADMIN)
  issue(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.certificationService.issueCertificate(user.id, id);
  }

  @Public()
  @Get('certificates/:qrToken/verify')
  verify(@Param('qrToken') qrToken: string) {
    return this.certificationService.verify(qrToken);
  }
}
