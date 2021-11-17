import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
}
