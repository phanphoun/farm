import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { RoleName } from '@prisma/client';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';
import { AuthenticatedUser } from '../common/types/authenticated-user';

interface AuthenticatedSocket extends Socket {
  data: {
    user?: AuthenticatedUser;
  };
}

interface JwtPayload {
  sub: string;
  email?: string | null;
  phone?: string | null;
  roles?: RoleName[];
}

@WebSocketGateway({
  namespace: '/realtime',
  cors: { origin: true, credentials: true }
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async afterInit(server: Server) {
    try {
      const host = this.config.get<string>('REDIS_HOST');
      if (!host) return;

      const pubClient = new Redis({
        host,
        port: this.config.get<number>('REDIS_PORT', 6379),
        password: this.config.get<string>('REDIS_PASSWORD') || undefined,
        lazyConnect: true,
        enableOfflineQueue: false,
        retryStrategy: () => null
      });
      const subClient = pubClient.duplicate();

      const onErr = (err: NodeJS.ErrnoException) =>
        this.logger.warn(`Redis unavailable (${err.code ?? err.message}) — Socket.io running without Redis adapter`);
      pubClient.on('error', onErr);
      subClient.on('error', onErr);

      await Promise.all([pubClient.connect(), subClient.connect()]);
      server.adapter(createAdapter(pubClient, subClient));
      this.logger.log('Socket.io Redis adapter enabled');
    } catch (error) {
      this.logger.warn(`Socket.io Redis adapter unavailable: ${(error as Error).message}`);
    }
  }

  async handleConnection(client: AuthenticatedSocket) {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET')
      });
      client.data.user = {
        id: payload.sub,
        email: payload.email,
        phone: payload.phone,
        roles: payload.roles ?? []
      };
      await client.join(`user:${payload.sub}`);
      this.logger.debug(`Socket connected for user ${payload.sub}`);
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    this.logger.debug(`Socket disconnected ${client.id}`);
  }

  @SubscribeMessage('chat.join')
  joinChat(@MessageBody() body: { roomId: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    void client.join(`chat:${body.roomId}`);
    return { joined: true, room: `chat:${body.roomId}` };
  }

  @SubscribeMessage('chat.send')
  sendChat(@MessageBody() body: { roomId: string; content: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    const user = client.data.user;
    if (!user) return { sent: false };

    this.server.to(`chat:${body.roomId}`).emit('chat.message', {
      roomId: body.roomId,
      senderId: user.id,
      content: body.content,
      createdAt: new Date().toISOString()
    });
    return { sent: true };
  }

  @SubscribeMessage('post.watch')
  watchPost(@MessageBody() body: { postId: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    void client.join(`post:${body.postId}`);
    return { watching: true };
  }

  @SubscribeMessage('farm.watch')
  watchFarm(@MessageBody() body: { farmId: string }, @ConnectedSocket() client: AuthenticatedSocket) {
    void client.join(`farm:${body.farmId}`);
    return { watching: true };
  }

  emitToUser(userId: string, event: string, payload: unknown) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  emitToRoom(room: string, event: string, payload: unknown) {
    this.server.to(room).emit(event, payload);
  }

  private extractToken(client: AuthenticatedSocket): string | undefined {
    const auth = client.handshake?.auth?.token ?? client.handshake?.headers?.authorization;
    if (!auth) return undefined;
    return String(auth).replace(/^Bearer\s+/i, '');
  }

  private getUserRoom(userId: string) {
    return `user:${userId}`;
  }
}
