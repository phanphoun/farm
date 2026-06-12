import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleName } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { AiChatDto } from './dto/ai-chat.dto';
import { AiIngestDto } from './dto/ai-ingest.dto';
import { ImageAnalysisDto } from './dto/image-analysis.dto';
import { AiService } from './ai.service';

@ApiBearerAuth()
@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  chat(@CurrentUser() user: AuthenticatedUser, @Body() dto: AiChatDto) {
    return this.aiService.chat(user.id, dto);
  }

  @Post('ingest')
  @Roles(RoleName.EXPERT, RoleName.NGO, RoleName.ADMIN, RoleName.SUPER_ADMIN)
  ingest(@CurrentUser() user: AuthenticatedUser, @Body() dto: AiIngestDto) {
    return this.aiService.ingestDocument(user.id, dto);
  }

  @Post('image-analysis')
  imageAnalysis(@CurrentUser() user: AuthenticatedUser, @Body() dto: ImageAnalysisDto) {
    return this.aiService.analyzeImage(user.id, dto);
  }

  @Get('conversations')
  conversations(@CurrentUser() user: AuthenticatedUser) {
    return this.aiService.listConversations(user.id);
  }

  @Get('conversations/:id')
  conversation(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.aiService.getConversation(user.id, id);
  }
}
