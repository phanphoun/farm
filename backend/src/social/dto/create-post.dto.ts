import { PostVisibility } from '@prisma/client';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  groupId?: string;

  @IsString()
  @MaxLength(5000)
  content!: string;

  @IsOptional()
  media?: unknown[];

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cropTags?: string[];
}
