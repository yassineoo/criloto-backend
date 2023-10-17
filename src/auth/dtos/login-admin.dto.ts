import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: 'string', example: 'jy_attou@esi.dz' })
  @IsPhoneNumber()
  email: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  password: string;
}
