import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, page = 1, limit = 20) {
    const take = Math.min(limit, 50);
    const skip = (Math.max(page, 1) - 1) * take;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      this.prisma.notification.count({ where: { userId } })
    ]);

    return {
      data: notifications.map((n) => this.format(n)),
      total,
      page,
      unreadCount: notifications.filter((n) => !n.readAt).length
    };
  }

  async markRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id, userId }
    });
    if (!notification) throw new NotFoundException('Notification not found');

    const updated = await this.prisma.notification.update({
      where: { id },
      data: { readAt: new Date() }
    });
    return this.format(updated);
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() }
    });
    return { success: true };
  }

  private format(n: {
    id: string;
    userId: string;
    type: string;
    title: string;
    body: string;
    data: unknown;
    readAt: Date | null;
    createdAt: Date;
  }) {
    const extra = (n.data ?? {}) as Record<string, unknown>;
    return {
      id: n.id,
      userId: n.userId,
      type: n.type,
      title: n.title,
      description: n.body,
      link: typeof extra['link'] === 'string' ? extra['link'] : undefined,
      fromUser: extra['fromUser'] ?? undefined,
      isRead: n.readAt !== null,
      createdAt: n.createdAt.toISOString()
    };
  }
}
