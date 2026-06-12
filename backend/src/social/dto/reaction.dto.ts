import { ReactionType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ReactionDto {
  @IsEnum(ReactionType)
  type!: ReactionType;
}
