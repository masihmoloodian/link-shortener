import { Injectable } from '@nestjs/common';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';

@Injectable()
export class UrlShortenerService {
  create(createUrlShortenerDto: CreateUrlShortenerDto) {
    return 'This action adds a new urlShortener';
  }

  findAll() {
    return `This action returns all urlShortener`;
  }

  findOne(id: number) {
    return `This action returns a #${id} urlShortener`;
  }

  update(id: number, updateUrlShortenerDto: UpdateUrlShortenerDto) {
    return `This action updates a #${id} urlShortener`;
  }

  remove(id: number) {
    return `This action removes a #${id} urlShortener`;
  }
}
