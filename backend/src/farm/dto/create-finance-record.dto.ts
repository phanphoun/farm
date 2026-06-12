import { FinanceRecordType } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateFinanceRecordDto {
  @IsEnum(FinanceRecordType)
  type!: FinanceRecordType;

  @IsString()
  category!: string;

  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsDateString()
  occurredAt?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  receiptUrl?: string;
}
