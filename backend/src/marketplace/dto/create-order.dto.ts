import { IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  shippingAddress?: Record<string, unknown>;
}
