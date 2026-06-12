import { OtpChannel, OtpPurpose } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class OtpVerifyDto {
  @IsString()
  @IsNotEmpty()
  target!: string;

  @IsEnum(OtpChannel)
  channel!: OtpChannel;

  @IsEnum(OtpPurpose)
  purpose!: OtpPurpose;

  @IsString()
  @Length(4, 8)
  code!: string;
}
