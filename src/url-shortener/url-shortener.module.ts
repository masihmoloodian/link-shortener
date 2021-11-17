import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';

@Module({
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService]
})
export class UrlShortenerModule {}
