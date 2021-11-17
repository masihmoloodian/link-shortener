import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUrl, ValidateIf } from "class-validator";

export class GetOriginalUrlDto {
    @ApiProperty()
    shortUrl: string

    @ApiPropertyOptional()
    @IsOptional()
    code: number

    @ApiPropertyOptional()
    @IsOptional()
    phonenumber: string
}
