import { OtpChannel, OtpPurpose } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class OtpRequestDto {
  @IsString()
  @IsNotEmpty()
  target!: string;

  @IsEnum(OtpChannel)
  channel!: OtpChannel;

  @IsEnum(OtpPurpose)
  purpose!: OtpPurpose;
}
