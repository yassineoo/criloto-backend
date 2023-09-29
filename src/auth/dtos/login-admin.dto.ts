import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({ type: 'string', example: '+213663838507' })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ example: 'pass' })
  @IsString()
  password: string;
}
