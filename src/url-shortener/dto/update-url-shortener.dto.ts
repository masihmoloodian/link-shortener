import { PartialType } from '@nestjs/swagger';
import { CreateUrlShortenerDto } from './create-url-shortener.dto';

export class UpdateUrlShortenerDto extends PartialType(CreateUrlShortenerDto) {}
