import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsUUID, Length, IsOptional } from 'class-validator';

export class OtpVerificationDTO {
  @ApiProperty({
    type: 'string',
    example: '144177',
    minLength: 6,
    maxLength: 6,
    required: true,
  })
  @Length(6, 6)
  otp: string;

  @ApiProperty({ type: 'string', example: '+213559398691', required: true })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({
    type: 'string',
    example: '308919e9-5730-4485-9a4c-9c2ad18bccd9',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  referrerId: string;
}
