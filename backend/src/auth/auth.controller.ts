import { Body, Controller, Get, Ip, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthenticatedUser } from '../common/types/authenticated-user';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { OtpRequestDto } from './dto/otp-request.dto';
import { OtpVerifyDto } from './dto/otp-verify.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto, @Req() request: Request, @Ip() ipAddress: string) {
    return this.authService.register(dto, request.headers['user-agent'], ipAddress);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Req() request: Request, @Ip() ipAddress: string) {
    return this.authService.login(dto, request.headers['user-agent'], ipAddress);
  }

  @Public()
  @Post('otp/request')
  requestOtp(@Body() dto: OtpRequestDto) {
    return this.authService.requestOtp(dto);
  }

  @Public()
  @Post('otp/verify')
  verifyOtp(@Body() dto: OtpVerifyDto) {
    return this.authService.verifyOtp(dto);
  }

  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto, @Req() request: Request, @Ip() ipAddress: string) {
    return this.authService.refresh(dto.refreshToken, request.headers['user-agent'], ipAddress);
  }

  @ApiBearerAuth()
  @Post('logout')
  logout(@Body() dto: RefreshTokenDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.me(user.id);
  }
}
