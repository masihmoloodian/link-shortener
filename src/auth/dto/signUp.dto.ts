import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
    @ApiProperty()
    user_name: string;

    @ApiProperty()
    phone_number: string;

    @ApiProperty()
    password: string;
}
