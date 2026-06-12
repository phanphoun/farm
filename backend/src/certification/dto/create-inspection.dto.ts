import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateInspectionDto {
  @IsString()
  inspectorId!: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  checklist?: Record<string, unknown>;
}
