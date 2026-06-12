import { ChatRoomType } from '@prisma/client';
import { ArrayMinSize, IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateChatRoomDto {
  @IsOptional()
  @IsEnum(ChatRoomType)
  type?: ChatRoomType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  participantIds!: string[];
}
