import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { RoleName } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUser } from '../../common/types/authenticated-user';

interface JwtPayload {
  sub: string;
  email?: string | null;
  phone?: string | null;
  roles?: RoleName[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET')
    });
  }

  validate(payload: JwtPayload): AuthenticatedUser {
    return {
      id: payload.sub,
      email: payload.email,
      phone: payload.phone,
      roles: payload.roles ?? []
    };
  }
}
