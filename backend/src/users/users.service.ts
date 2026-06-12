import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        phone: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        locale: true,
        province: true,
        district: true,
        commune: true,
        village: true,
        status: true,
        createdAt: true,
        roles: { select: { role: { select: { name: true } } } }
      }
    });
    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      roles: user.roles.map(({ role }) => role.name)
    };
  }

  async profile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        province: true,
        district: true,
        commune: true,
        village: true,
        createdAt: true,
        roles: { select: { role: { select: { name: true } } } },
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
            ownedFarms: true
          }
        }
      }
    });
    if (!user) throw new NotFoundException('User not found');
    return {
      ...user,
      roles: user.roles.map(({ role }) => role.name)
    };
  }

  updateProfile(id: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        displayName: true,
        avatarUrl: true,
        bio: true,
        locale: true,
        province: true,
        district: true,
        commune: true,
        village: true,
        updatedAt: true
      }
    });
  }
}
