import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsPhoneNumber, IsString } from 'class-validator';
import { UserRole } from '../types/userRole.enum';

export class CreateUserDto {
  @ApiProperty({ type: 'string', example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ type: 'string', example: 'Doe' })
  @IsString()
  familyName: string;

  @ApiProperty({ type: 'string', example: 'pass' })
  @IsString()
  password: string;

  @ApiProperty({ type: 'date', example: '1998-12-12' })
  @IsDate()
  birthday: Date;

  @ApiProperty({ type: 'string', example: 'jy_attou@esi.dz' })
  @IsString()
  email: string;

  @ApiProperty({ type: 'string', example: '+21374074589' })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ type: 'enum', example: UserRole.CLIENT, enum: UserRole })
  @IsString()
  role: UserRole;
}
