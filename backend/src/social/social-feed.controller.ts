import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { SocialService } from './social.service';

@ApiBearerAuth()
@ApiTags('Social')
@Controller('feed')
export class FeedController {
  constructor(private readonly socialService: SocialService) {}

  @Get()
  feed(@CurrentUser() user: AuthenticatedUser, @Query('take') take = 20, @Query('skip') skip = 0) {
    return this.socialService.feed(user.id, Number(take), Number(skip));
  }
}
