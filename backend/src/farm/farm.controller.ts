import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { CreateCropCycleDto } from './dto/create-crop-cycle.dto';
import { CreateFarmTaskDto } from './dto/create-farm-task.dto';
import { CreateFarmDto } from './dto/create-farm.dto';
import { CreateFinanceRecordDto } from './dto/create-finance-record.dto';
import { CreatePlotDto } from './dto/create-plot.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { FarmService } from './farm.service';

@ApiBearerAuth()
@ApiTags('Farm')
@Controller('farms')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.farmService.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateFarmDto) {
    return this.farmService.create(user.id, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.farmService.get(user.id, id);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdateFarmDto) {
    return this.farmService.update(user.id, id, dto);
  }

  @Post(':id/plots')
  createPlot(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: CreatePlotDto) {
    return this.farmService.createPlot(user.id, id, dto);
  }

  @Post(':id/crop-cycles')
  createCropCycle(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateCropCycleDto
  ) {
    return this.farmService.createCropCycle(user.id, id, dto);
  }

  @Post(':id/tasks')
  createTask(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: CreateFarmTaskDto) {
    return this.farmService.createTask(user.id, id, dto);
  }

  @Post(':id/finance-records')
  createFinanceRecord(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateFinanceRecordDto
  ) {
    return this.farmService.createFinanceRecord(user.id, id, dto);
  }

  @Get(':id/dashboard')
  dashboard(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.farmService.dashboard(user.id, id);
  }
}
