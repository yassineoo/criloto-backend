import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsUUID, Length, IsOptional } from 'class-validator';

export class OtpVerificationUpdateDTO {
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
}
