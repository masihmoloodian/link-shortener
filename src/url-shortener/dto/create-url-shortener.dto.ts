import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUrl, ValidateIf } from "class-validator";

export class CreateUrlShortenerDto {
    @ApiProperty()
    originalUrl: string

    @ApiPropertyOptional()
    @IsOptional()
    shortUrl: string

    @ApiPropertyOptional()
    @IsOptional()
    expire_date: Date
}
