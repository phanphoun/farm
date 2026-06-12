import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { SocialService } from './social.service';

@ApiBearerAuth()
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly socialService: SocialService) {}

  @Post('rooms')
  createRoom(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateChatRoomDto) {
    return this.socialService.createChatRoom(user.id, dto);
  }

  @Post('rooms/:id/messages')
  sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') roomId: string,
    @Body() dto: SendChatMessageDto
  ) {
    return this.socialService.sendChatMessage(user.id, roomId, dto);
  }
}
