import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { RoleName } from '@prisma/client';

export class RegisterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({
    enum: ['FARMER', 'VENDOR', 'EXPERT', 'TEACHER', 'ADMIN', 'NGO', 'GOV', 'SUPER_ADMIN'],
    example: 'FARMER',
  })
  @IsOptional()
  @IsEnum(['FARMER', 'VENDOR', 'EXPERT', 'TEACHER', 'ADMIN', 'NGO', 'GOV', 'SUPER_ADMIN'])
  @Transform(({ value }) => {
    if (typeof value !== 'string') return value;
    const normalized = value.trim().toUpperCase();
    const valid = ['FARMER', 'VENDOR', 'EXPERT', 'TEACHER', 'ADMIN', 'NGO', 'GOV', 'SUPER_ADMIN'];
    return valid.includes(normalized) ? normalized : undefined;
  })
  role?: RoleName;
}
