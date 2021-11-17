import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    phonenumber: string;

    @ApiProperty()
    password: string;
}
