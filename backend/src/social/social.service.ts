import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatRoomType, ContentStatus, GroupMemberRole, Prisma } from '@prisma/client';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { SearchService } from '../search/search.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatRoomDto } from './dto/create-chat-room.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { ReactionDto } from './dto/reaction.dto';
import { SendChatMessageDto } from './dto/send-chat-message.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class SocialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly search: SearchService
  ) {}

  async feed(userId: string, take = 20, skip = 0) {
    const following = await this.prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
    const followingIds = following.map((item) => item.followingId);

    return this.prisma.post.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        OR: [{ visibility: 'PUBLIC' }, { authorId: { in: followingIds } }, { authorId: userId }]
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Math.min(take, 50),
      include: this.postInclude()
    });
  }

  async createPost(authorId: string, dto: CreatePostDto) {
    const post = await this.prisma.post.create({
      data: {
        authorId,
        groupId: dto.groupId,
        content: dto.content,
        media: (dto.media ?? []) as Prisma.InputJsonValue,
        visibility: dto.visibility ?? 'PUBLIC',
        locationName: dto.locationName,
        latitude: dto.latitude,
        longitude: dto.longitude,
        cropTags: (dto.cropTags ?? []) as Prisma.InputJsonValue,
      },
      include: this.postInclude(),
    });

    await this.search.indexDocument('posts', {
      id: post.id,
      content: post.content,
      authorId: post.authorId,
      cropTags: post.cropTags,
      createdAt: post.createdAt
    });
    this.realtime.emitToRoom('feed:public', 'feed.updated', { postId: post.id });
    return post;
  }

  async getPost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: this.postInclude()
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async updatePost(userId: string, id: string, dto: UpdatePostDto) {
    await this.assertPostOwner(userId, id);
    const data: Prisma.PostUncheckedUpdateInput = {
      ...(dto.groupId !== undefined && { groupId: dto.groupId }),
      ...(dto.content !== undefined && { content: dto.content }),
      ...(dto.media !== undefined && { media: dto.media as Prisma.InputJsonValue }),
      ...(dto.visibility !== undefined && { visibility: dto.visibility }),
      ...(dto.locationName !== undefined && { locationName: dto.locationName }),
      ...(dto.latitude !== undefined && { latitude: dto.latitude }),
      ...(dto.longitude !== undefined && { longitude: dto.longitude }),
      ...(dto.cropTags !== undefined && { cropTags: dto.cropTags as Prisma.InputJsonValue }),
      ...(dto.status !== undefined && { status: dto.status }),
    };
    return this.prisma.post.update({ where: { id }, data, include: this.postInclude() });
  }

  async deletePost(userId: string, id: string) {
    await this.assertPostOwner(userId, id);
    await this.prisma.post.update({
      where: { id },
      data: { status: ContentStatus.REMOVED, deletedAt: new Date() }
    });
    return { deleted: true };
  }

  comments(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId, status: ContentStatus.PUBLISHED, parentId: null },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
        replies: {
          include: { author: { select: { id: true, displayName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });
  }

  async createComment(authorId: string, postId: string, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.create({
      data: {
        authorId,
        postId,
        parentId: dto.parentId,
        content: dto.content
      },
      include: { author: { select: { id: true, displayName: true, avatarUrl: true } } }
    });
    this.realtime.emitToRoom(`post:${postId}`, 'post.updated', { postId, commentId: comment.id });
    return comment;
  }

  reactToPost(userId: string, postId: string, dto: ReactionDto) {
    return this.prisma.reaction.upsert({
      where: { userId_postId_type: { userId, postId, type: dto.type } },
      update: {},
      create: { userId, postId, type: dto.type }
    });
  }

  async removePostReactions(userId: string, postId: string) {
    await this.prisma.reaction.deleteMany({ where: { userId, postId } });
    return { removed: true };
  }

  follow(followerId: string, followingId: string) {
    if (followerId === followingId) throw new ForbiddenException('Cannot follow yourself');
    return this.prisma.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      update: {},
      create: { followerId, followingId }
    });
  }

  async unfollow(followerId: string, followingId: string) {
    await this.prisma.follow.deleteMany({ where: { followerId, followingId } });
    return { unfollowed: true };
  }

  createGroup(ownerId: string, dto: CreateGroupDto) {
    const slug = this.slugify(dto.name);
    return this.prisma.group.create({
      data: {
        ownerId,
        name: dto.name,
        slug: `${slug}-${Date.now().toString(36)}`,
        description: dto.description,
        visibility: dto.visibility ?? 'PUBLIC',
        province: dto.province,
        cropTags: dto.cropTags ?? [],
        members: {
          create: {
            userId: ownerId,
            role: GroupMemberRole.OWNER
          }
        }
      }
    });
  }

  async getGroup(id: string) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, displayName: true, avatarUrl: true } },
        _count: { select: { members: true, posts: true } }
      }
    });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  joinGroup(userId: string, groupId: string) {
    return this.prisma.groupMember.upsert({
      where: { groupId_userId: { groupId, userId } },
      update: {},
      create: { groupId, userId, role: GroupMemberRole.MEMBER }
    });
  }

  createChatRoom(ownerId: string, dto: CreateChatRoomDto) {
    const participantIds = Array.from(new Set([ownerId, ...dto.participantIds]));
    return this.prisma.chatRoom.create({
      data: {
        type: dto.type ?? ChatRoomType.DIRECT,
        title: dto.title,
        participants: {
          createMany: {
            data: participantIds.map((userId) => ({ userId }))
          }
        }
      },
      include: { participants: true }
    });
  }

  async sendChatMessage(senderId: string, roomId: string, dto: SendChatMessageDto) {
    const participant = await this.prisma.chatParticipant.findUnique({
      where: { roomId_userId: { roomId, userId: senderId } }
    });
    if (!participant) throw new ForbiddenException('Not a chat participant');

    const message = await this.prisma.chatMessage.create({
      data: {
        roomId,
        senderId,
        kind: dto.kind ?? 'TEXT',
        content: dto.content,
        media: (dto.media ?? []) as Prisma.InputJsonValue,
      },
      include: { sender: { select: { id: true, displayName: true, avatarUrl: true } } }
    });

    this.realtime.emitToRoom(`chat:${roomId}`, 'chat.message', message);
    return message;
  }

  private async assertPostOwner(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.authorId !== userId) throw new ForbiddenException('Only the author can modify this post');
  }

  private postInclude() {
    return {
      author: { select: { id: true, displayName: true, avatarUrl: true, province: true } },
      group: { select: { id: true, name: true, slug: true } },
      _count: { select: { comments: true, reactions: true } }
    } satisfies Prisma.PostInclude;
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}
