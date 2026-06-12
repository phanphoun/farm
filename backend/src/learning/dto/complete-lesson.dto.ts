import { IsInt, IsOptional, Min, Max } from 'class-validator';

export class CompleteLessonDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPct?: number;
}
