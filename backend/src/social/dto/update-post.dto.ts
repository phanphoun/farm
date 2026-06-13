import { ContentStatus, PostVisibility } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}
