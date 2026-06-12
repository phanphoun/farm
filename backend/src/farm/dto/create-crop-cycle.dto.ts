import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCropCycleDto {
  @IsOptional()
  @IsString()
  plotId?: string;

  @IsString()
  cropId!: string;

  @IsOptional()
  @IsString()
  variety?: string;

  @IsOptional()
  @IsDateString()
  plantedAt?: string;

  @IsOptional()
  @IsDateString()
  expectedHarvestAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
