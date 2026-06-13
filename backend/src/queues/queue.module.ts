import { DynamicModule, Global, Logger, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { QUEUES } from './queue.constants';

const logger = new Logger('QueueModule');

@Global()
@Module({})
export class QueueModule {
  static forRootAsync(): DynamicModule {
    const redisHost = process.env['REDIS_HOST'];

    if (!redisHost) {
      logger.debug('REDIS_HOST not set — BullMQ queues disabled (OK for local dev).');
      return { module: QueueModule, global: true, imports: [], exports: [] };
    }

    return {
      module: QueueModule,
      global: true,
      imports: [
        BullModule.forRootAsync({
          useFactory: (config: ConfigService) => ({
            connection: {
              host: config.get<string>('REDIS_HOST', 'localhost'),
              port: config.get<number>('REDIS_PORT', 6379),
              password: config.get<string>('REDIS_PASSWORD') || undefined
            },
            defaultJobOptions: {
              attempts: 3,
              backoff: { type: 'exponential', delay: 5_000 },
              removeOnComplete: 1_000,
              removeOnFail: 5_000
            }
          }),
          inject: [ConfigService]
        }),
        BullModule.registerQueue(
          { name: QUEUES.notifications },
          { name: QUEUES.search },
          { name: QUEUES.ai },
          { name: QUEUES.certificates }
        )
      ],
      exports: [BullModule]
    };
  }
}
