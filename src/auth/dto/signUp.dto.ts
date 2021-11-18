import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber } from "class-validator";

export class SignUpDto {
    @ApiProperty()
    user_name: string;

    @ApiProperty()
    @IsPhoneNumber('IR')
    phone_number: string;

    @ApiProperty()
    password: string;
}
