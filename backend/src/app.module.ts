import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from './config/env.validation';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { UsersModule } from './users/users.module';
import { SocialModule } from './social/social.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { LearningModule } from './learning/learning.module';
import { FarmModule } from './farm/farm.module';
import { AiModule } from './ai/ai.module';
import { ConsultationModule } from './consultation/consultation.module';
import { CertificationModule } from './certification/certification.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RealtimeModule } from './realtime/realtime.module';
import { QueueModule } from './queues/queue.module';
import { SearchModule } from './search/search.module';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120
      }
    ]),
    PrismaModule,
    QueueModule,
    SearchModule,
    StorageModule,
    HealthModule,
    AuthModule,
    UsersModule,
    SocialModule,
    MarketplaceModule,
    LearningModule,
    FarmModule,
    AiModule,
    ConsultationModule,
    CertificationModule,
    NotificationsModule,
    RealtimeModule
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard }
  ]
})
export class AppModule {}
