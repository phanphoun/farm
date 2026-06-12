import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFarmDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  commune?: string;

  @IsOptional()
  @IsString()
  village?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  areaHectares?: number;

  @IsOptional()
  boundaryGeojson?: Record<string, unknown>;
}
