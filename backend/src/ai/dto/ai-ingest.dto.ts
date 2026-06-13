import { IsOptional, IsString, MinLength } from 'class-validator';

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
  cropTags?: string[];

  @IsOptional()
  provinceTags?: string[];

  @IsString()
  @MinLength(20)
  text!: string;
}
