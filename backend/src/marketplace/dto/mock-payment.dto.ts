import { IsOptional, IsString } from 'class-validator';

export class MockPaymentDto {
  @IsOptional()
  @IsString()
  provider?: string;
}
