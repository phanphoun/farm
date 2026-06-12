import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';

export class AiIngestDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  cropTags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  provinceTags?: string[];

  @IsString()
  @MinLength(20)
  text!: string;
}
