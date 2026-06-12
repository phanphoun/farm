import { IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class AiChatDto {
  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsString()
  @MaxLength(8000)
  message!: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsObject()
  farmContext?: Record<string, unknown>;
}
