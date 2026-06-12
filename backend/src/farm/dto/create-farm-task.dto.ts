import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateFarmTaskDto {
  @IsOptional()
  @IsString()
  plotId?: string;

  @IsOptional()
  @IsString()
  cropCycleId?: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueAt?: string;
}
