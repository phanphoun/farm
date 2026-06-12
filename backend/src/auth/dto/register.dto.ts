import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength
} from 'class-validator';

export class RegisterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @IsNotEmpty()
  displayName!: string;

  @ApiPropertyOptional({ enum: RoleName })
  @IsOptional()
  @IsEnum(RoleName)
  role?: RoleName;
}
