import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUrl, ValidateIf } from "class-validator";

export class CreateUrlShortenerDto {
    @ApiProperty()
    originalUrl: string

    @ApiPropertyOptional()
    @IsOptional()
    customName: string

    @ApiPropertyOptional()
    @IsOptional()
    expire_date: Date

    @ApiProperty({ default: false })
    is_private: boolean

    @ApiPropertyOptional()
    @IsOptional()
    phonenumber: string
}
