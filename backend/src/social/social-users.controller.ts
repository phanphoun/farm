import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { SocialService } from './social.service';

@ApiBearerAuth()
@ApiTags('Social')
@Controller('users')
export class SocialUsersController {
  constructor(private readonly socialService: SocialService) {}

  @Post(':id/follow')
  follow(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.socialService.follow(user.id, id);
  }

  @Delete(':id/follow')
  unfollow(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.socialService.unfollow(user.id, id);
  }
}
