import { MessageKind } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class SendChatMessageDto {
  @IsOptional()
  @IsEnum(MessageKind)
  kind?: MessageKind;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  content?: string;

  @IsOptional()
  media?: unknown[];
}
