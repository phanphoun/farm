import { GroupVisibility } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(GroupVisibility)
  visibility?: GroupVisibility;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cropTags?: string[];
}
