import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { ReactionDto } from './dto/reaction.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SocialService } from './social.service';

@ApiBearerAuth()
@ApiTags('Social')
@Controller('posts')
export class PostsController {
  constructor(private readonly socialService: SocialService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreatePostDto) {
    return this.socialService.createPost(user.id, dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.socialService.getPost(id);
  }

  @Patch(':id')
  update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.socialService.updatePost(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.socialService.deletePost(user.id, id);
  }

  @Get(':id/comments')
  comments(@Param('id') id: string) {
    return this.socialService.comments(id);
  }

  @Post(':id/comments')
  comment(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: CreateCommentDto) {
    return this.socialService.createComment(user.id, id, dto);
  }

  @Post(':id/reactions')
  react(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body() dto: ReactionDto) {
    return this.socialService.reactToPost(user.id, id, dto);
  }

  /** Convenience alias used by the mobile frontend */
  @Post(':id/like')
  like(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.socialService.toggleLike(user.id, id);
  }

  @Delete(':id/reactions')
  unreact(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.socialService.removePostReactions(user.id, id);
  }
}
