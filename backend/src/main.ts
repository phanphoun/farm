import 'reflect-metadata';
import compression from 'compression';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const apiPrefix = process.env.API_PREFIX ?? 'api';
  const corsOrigins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true
  });
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );
  
  const swaggerConfig = new DocumentBuilder()
    .setTitle('FarmJumnoy Backend API')
    .setDescription('Agritech platform API for Cambodia farmers, vendors, experts, NGOs, and admins.')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // Serve uploaded files statically
  const uploadsDir = join(process.cwd(), 'uploads');
  mkdirSync(uploadsDir, { recursive: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (app as any).use('/uploads', express.static(uploadsDir));

  const port = Number(process.env.PORT ?? 4001);
  await app.listen(port, '0.0.0.0');
}

void bootstrap();
