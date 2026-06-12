import { CourseStatus } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
