import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateCertificationApplicationDto {
  @IsString()
  typeId!: string;

  @IsString()
  farmId!: string;

  @IsOptional()
  formData?: Record<string, unknown>;

  @IsOptional()
  documents?: unknown[];

  @IsOptional()
  @IsBoolean()
  submit?: boolean;
}
