import { ProductStatus } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  images?: unknown[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
