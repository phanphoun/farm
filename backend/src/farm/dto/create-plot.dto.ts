import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePlotDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  cropHint?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  areaHectares?: number;

  @IsOptional()
  boundaryGeojson?: Record<string, unknown>;
}
