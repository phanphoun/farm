import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsString()
  parentId?: string;

  @IsString()
  @MaxLength(2000)
  content!: string;
}
