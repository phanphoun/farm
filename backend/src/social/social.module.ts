import { Module } from '@nestjs/common';
import { RealtimeModule } from '../realtime/realtime.module';
import { StorageModule } from '../storage/storage.module';
import { MediaController } from '../storage/media.controller';
import { ChatController } from './social-chat.controller';
import { FeedController } from './social-feed.controller';
import { GroupsController } from './social-groups.controller';
import { PostsController } from './social-posts.controller';
import { SocialUsersController } from './social-users.controller';
import { SocialService } from './social.service';

@Module({
  imports: [RealtimeModule, StorageModule],
  controllers: [MediaController, FeedController, PostsController, GroupsController, ChatController, SocialUsersController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
