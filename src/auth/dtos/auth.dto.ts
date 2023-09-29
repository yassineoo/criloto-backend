import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsPhoneNumber } from "class-validator";

export class AuthDTO{
    @ApiProperty({ type:'string',example:"+213559398691"})
    @IsPhoneNumber()
    phoneNumber:string;
}