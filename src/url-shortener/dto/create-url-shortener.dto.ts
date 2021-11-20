import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUrl, ValidateIf } from "class-validator";

export class CreateUrlShortenerDto {
    @ApiProperty()
    original_url: string

    @ApiPropertyOptional()
    @IsOptional()
    short_key: string

    @ApiPropertyOptional()
    @IsOptional()
    expire_date: Date

    @ApiProperty({ default: false })
    is_private: boolean

    @ApiPropertyOptional()
    @IsOptional()
    phone_number: string
}
