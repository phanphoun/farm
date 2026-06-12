import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { OtpPurpose, Prisma, RoleName, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes, randomInt } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { OtpRequestDto } from './dto/otp-request.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { RegisterDto } from './dto/register.dto';

const userInclude = {
  roles: {
    include: {
      role: true
    }
  }
} satisfies Prisma.UserInclude;

type UserWithRoles = Prisma.UserGetPayload<{ include: typeof userInclude }>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService
  ) {}

  async register(dto: RegisterDto, userAgent?: string, ipAddress?: string) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Email or phone is required');
    }

    const normalizedEmail = dto.email?.toLowerCase();
    const normalizedPhone = dto.phone;
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { phone: normalizedPhone }].filter((condition) =>
          Object.values(condition).some(Boolean)
        )
      }
    });

    if (existing) {
      throw new ConflictException('A user with this email or phone already exists');
    }

    const roleName = this.safeRegistrationRole(dto.role);
    const role = await this.prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      throw new BadRequestException('Roles have not been seeded yet');
    }

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash: await bcrypt.hash(dto.password, 12),
        displayName: dto.displayName,
        status: 'PENDING_VERIFICATION',
        roles: {
          create: {
            roleId: role.id
          }
        },
        cart: {
          create: {}
        }
      },
      include: userInclude
    });

    return this.issueTokenPair(user, userAgent, ipAddress);
  }

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
    const identifier = dto.identifier.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: dto.identifier.trim() }],
        deletedAt: null
      },
      include: userInclude
    });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.status === 'SUSPENDED' || user.status === 'DELETED') {
      throw new UnauthorizedException('Account is not active');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    return this.issueTokenPair(user, userAgent, ipAddress);
  }

  async requestOtp(dto: OtpRequestDto) {
    const target = this.normalizeTarget(dto.target);
    const code = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + this.config.getOrThrow<number>('OTP_TTL_MINUTES') * 60_000);
    const user = await this.findUserByTarget(target);

    await this.prisma.otpToken.create({
      data: {
        userId: user?.id,
        target,
        channel: dto.channel,
        purpose: dto.purpose,
        codeHash: this.hashSecret(code),
        expiresAt
      }
    });

    return {
      target,
      channel: dto.channel,
      purpose: dto.purpose,
      expiresAt,
      devCode: this.config.get<boolean>('OTP_DEV_MODE') ? code : undefined
    };
  }

  async verifyOtp(dto: OtpVerifyDto) {
    const target = this.normalizeTarget(dto.target);
    const token = await this.prisma.otpToken.findFirst({
      where: {
        target,
        channel: dto.channel,
        purpose: dto.purpose,
        consumedAt: null,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!token) {
      throw new BadRequestException('OTP is expired or invalid');
    }

    if (token.codeHash !== this.hashSecret(dto.code)) {
      await this.prisma.otpToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } }
      });
      throw new BadRequestException('OTP is expired or invalid');
    }

    await this.prisma.otpToken.update({
      where: { id: token.id },
      data: { consumedAt: new Date() }
    });

    if (dto.purpose === OtpPurpose.VERIFY_EMAIL || dto.purpose === OtpPurpose.VERIFY_PHONE) {
      await this.markTargetVerified(target, dto.purpose);
    }

    return { verified: true };
  }

  async refresh(refreshToken: string, userAgent?: string, ipAddress?: string) {
    const tokenHash = this.hashSecret(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: { include: userInclude } }
    });

    if (!stored || stored.revokedAt || stored.expiresAt <= new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() }
    });

    return this.issueTokenPair(stored.user, userAgent, ipAddress);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash: this.hashSecret(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() }
    });

    return { loggedOut: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: userInclude
    });
    return this.toSafeUser(user);
  }

  private async issueTokenPair(user: UserWithRoles, userAgent?: string, ipAddress?: string) {
    const roles = user.roles.map(({ role }) => role.name);
    const payload = {
      sub: user.id,
      email: user.email,
      phone: user.phone,
      roles
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_TTL', '15m') as JwtSignOptions['expiresIn']
    });

    const refreshToken = randomBytes(48).toString('base64url');
    const refreshTtlDays = this.config.get<number>('JWT_REFRESH_TTL_DAYS', 30);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashSecret(refreshToken),
        userAgent,
        ipAddress,
        expiresAt: new Date(Date.now() + refreshTtlDays * 24 * 60 * 60 * 1000)
      }
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      user: this.toSafeUser(user)
    };
  }

  private safeRegistrationRole(role?: RoleName) {
    if (!role) return RoleName.FARMER;
    if ([RoleName.ADMIN, RoleName.SUPER_ADMIN, RoleName.GOV].includes(role)) {
      return RoleName.FARMER;
    }
    return role;
  }

  private normalizeTarget(target: string) {
    return target.includes('@') ? target.trim().toLowerCase() : target.trim();
  }

  private async findUserByTarget(target: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [{ email: target }, { phone: target }]
      }
    });
  }

  private async markTargetVerified(target: string, purpose: OtpPurpose) {
    const data =
      purpose === OtpPurpose.VERIFY_EMAIL
        ? { emailVerifiedAt: new Date(), status: 'ACTIVE' as const }
        : { phoneVerifiedAt: new Date(), status: 'ACTIVE' as const };

    await this.prisma.user.updateMany({
      where:
        purpose === OtpPurpose.VERIFY_EMAIL
          ? { email: target }
          : { phone: target },
      data
    });
  }

  private hashSecret(value: string) {
    return createHash('sha256')
      .update(value)
      .update(this.config.getOrThrow<string>('JWT_REFRESH_SECRET'))
      .digest('hex');
  }

  private toSafeUser(user: UserWithRoles) {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      locale: user.locale,
      status: user.status,
      roles: user.roles.map(({ role }) => role.name),
      createdAt: user.createdAt
    };
  }
}
