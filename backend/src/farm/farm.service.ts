import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { FarmTaskStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCropCycleDto } from './dto/create-crop-cycle.dto';
import { CreateFarmTaskDto } from './dto/create-farm-task.dto';
import { CreateFarmDto } from './dto/create-farm.dto';
import { CreateFinanceRecordDto } from './dto/create-finance-record.dto';
import { CreatePlotDto } from './dto/create-plot.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Injectable()
export class FarmService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.farm.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }]
      },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { plots: true, cropCycles: true, tasks: true } } }
    });
  }

  async create(ownerId: string, dto: CreateFarmDto) {
    const farm = await this.prisma.farm.create({
      data: {
        ownerId,
        name: dto.name,
        description: dto.description,
        province: dto.province,
        district: dto.district,
        commune: dto.commune,
        village: dto.village,
        address: dto.address,
        areaHectares: dto.areaHectares,
        boundaryGeojson: dto.boundaryGeojson,
        members: {
          create: { userId: ownerId, role: 'OWNER' }
        }
      }
    });

    await this.syncFarmGeometry(farm.id, dto.boundaryGeojson);
    return farm;
  }

  async get(userId: string, farmId: string) {
    await this.assertFarmAccess(userId, farmId);
    const farm = await this.prisma.farm.findUnique({
      where: { id: farmId },
      include: {
        plots: true,
        cropCycles: { include: { crop: true, plot: true }, orderBy: { createdAt: 'desc' } },
        tasks: { orderBy: { dueAt: 'asc' } },
        financeRecords: { take: 25, orderBy: { occurredAt: 'desc' } }
      }
    });
    if (!farm) throw new NotFoundException('Farm not found');
    return farm;
  }

  async update(userId: string, farmId: string, dto: UpdateFarmDto) {
    await this.assertFarmOwner(userId, farmId);
    const farm = await this.prisma.farm.update({
      where: { id: farmId },
      data: dto
    });
    await this.syncFarmGeometry(farmId, dto.boundaryGeojson);
    return farm;
  }

  async createPlot(userId: string, farmId: string, dto: CreatePlotDto) {
    await this.assertFarmAccess(userId, farmId);
    const plot = await this.prisma.farmPlot.create({
      data: {
        farmId,
        name: dto.name,
        cropHint: dto.cropHint,
        areaHectares: dto.areaHectares,
        boundaryGeojson: dto.boundaryGeojson
      }
    });
    await this.syncPlotGeometry(plot.id, dto.boundaryGeojson);
    return plot;
  }

  async createCropCycle(userId: string, farmId: string, dto: CreateCropCycleDto) {
    await this.assertFarmAccess(userId, farmId);
    return this.prisma.cropCycle.create({
      data: {
        farmId,
        plotId: dto.plotId,
        cropId: dto.cropId,
        variety: dto.variety,
        plantedAt: dto.plantedAt ? new Date(dto.plantedAt) : undefined,
        expectedHarvestAt: dto.expectedHarvestAt ? new Date(dto.expectedHarvestAt) : undefined,
        notes: dto.notes,
        status: dto.plantedAt ? 'ACTIVE' : 'PLANNED'
      },
      include: { crop: true, plot: true }
    });
  }

  async createTask(userId: string, farmId: string, dto: CreateFarmTaskDto) {
    await this.assertFarmAccess(userId, farmId);
    return this.prisma.farmTask.create({
      data: {
        farmId,
        plotId: dto.plotId,
        cropCycleId: dto.cropCycleId,
        title: dto.title,
        description: dto.description,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined
      }
    });
  }

  async createFinanceRecord(userId: string, farmId: string, dto: CreateFinanceRecordDto) {
    await this.assertFarmAccess(userId, farmId);
    return this.prisma.farmFinanceRecord.create({
      data: {
        farmId,
        type: dto.type,
        category: dto.category,
        amount: dto.amount,
        currency: dto.currency ?? 'KHR',
        occurredAt: dto.occurredAt ? new Date(dto.occurredAt) : new Date(),
        note: dto.note,
        receiptUrl: dto.receiptUrl
      }
    });
  }

  async dashboard(userId: string, farmId: string) {
    await this.assertFarmAccess(userId, farmId);
    const [tasksOpen, cropCycles, finance] = await Promise.all([
      this.prisma.farmTask.count({
        where: { farmId, status: { in: [FarmTaskStatus.TODO, FarmTaskStatus.IN_PROGRESS] } }
      }),
      this.prisma.cropCycle.count({ where: { farmId, status: 'ACTIVE' } }),
      this.prisma.farmFinanceRecord.groupBy({
        by: ['type'],
        where: { farmId },
        _sum: { amount: true }
      })
    ]);

    return {
      tasksOpen,
      activeCropCycles: cropCycles,
      finance: finance.reduce<Record<string, Prisma.Decimal | null>>((acc, item) => {
        acc[item.type.toLowerCase()] = item._sum.amount;
        return acc;
      }, {})
    };
  }

  private async assertFarmAccess(userId: string, farmId: string) {
    const farm = await this.prisma.farm.findFirst({
      where: {
        id: farmId,
        OR: [{ ownerId: userId }, { members: { some: { userId } } }]
      },
      select: { id: true }
    });
    if (!farm) throw new ForbiddenException('No access to farm');
  }

  private async assertFarmOwner(userId: string, farmId: string) {
    const farm = await this.prisma.farm.findFirst({
      where: { id: farmId, ownerId: userId },
      select: { id: true }
    });
    if (!farm) throw new ForbiddenException('Only the owner can modify this farm');
  }

  private async syncFarmGeometry(farmId: string, geojson?: Record<string, unknown>) {
    if (!geojson) return;
    const json = JSON.stringify(geojson);
    await this.prisma.$executeRaw`
      UPDATE farms
      SET boundary = ST_SetSRID(ST_Multi(ST_GeomFromGeoJSON(${json})), 4326),
          centroid = ST_Centroid(ST_SetSRID(ST_Multi(ST_GeomFromGeoJSON(${json})), 4326))
      WHERE id = ${farmId}
    `;
  }

  private async syncPlotGeometry(plotId: string, geojson?: Record<string, unknown>) {
    if (!geojson) return;
    const json = JSON.stringify(geojson);
    await this.prisma.$executeRaw`
      UPDATE farm_plots
      SET boundary = ST_SetSRID(ST_GeomFromGeoJSON(${json}), 4326),
          centroid = ST_Centroid(ST_SetSRID(ST_GeomFromGeoJSON(${json}), 4326))
      WHERE id = ${plotId}
    `;
  }
}
