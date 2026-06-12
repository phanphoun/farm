import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { CreateGroupDto } from './dto/create-group.dto';
import { SocialService } from './social.service';

@ApiBearerAuth()
@ApiTags('Social')
@Controller('groups')
export class GroupsController {
  constructor(private readonly socialService: SocialService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateGroupDto) {
    return this.socialService.createGroup(user.id, dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.socialService.getGroup(id);
  }

  @Post(':id/join')
  join(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.socialService.joinGroup(user.id, id);
  }
}
