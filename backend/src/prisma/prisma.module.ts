import { DynamicModule, Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {
  static forRoot(options: { schema?: string } = {}): DynamicModule {
    const schema = (options as any).schema ?? (typeof __dirname !== 'undefined' ? `${__dirname}/../prisma/schema.prisma` : undefined);
    if (typeof schema === 'string' && !schema.includes('prisma/schema.prisma')) {
      throw new Error('PrismaModule requires a path to Prisma schema');
    }
    return {
      module: PrismaModule,
      providers: [PrismaService],
      exports: [PrismaService]
    };
  }
}
