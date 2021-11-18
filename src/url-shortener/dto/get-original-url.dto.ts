import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsUrl, ValidateIf } from "class-validator";

export class GetOriginalUrlDto {
    @ApiProperty()
    custom_name: string

    @ApiPropertyOptional()
    @IsOptional()
    code: number

    @ApiPropertyOptional()
    @IsOptional()
    phone_number: string
}
