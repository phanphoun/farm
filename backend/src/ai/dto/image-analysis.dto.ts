import { IsOptional, IsString, IsUrl } from 'class-validator';

export class ImageAnalysisDto {
  @IsUrl({ require_tld: false })
  imageUrl!: string;

  @IsOptional()
  @IsString()
  farmId?: string;

  @IsOptional()
  @IsString()
  plotId?: string;

  @IsOptional()
  @IsString()
  cropName?: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
