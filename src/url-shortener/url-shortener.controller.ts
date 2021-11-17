import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';

@Controller('url-shortener')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post()
  create(@Body() createUrlShortenerDto: CreateUrlShortenerDto) {
    return this.urlShortenerService.create(createUrlShortenerDto);
  }

  @Get()
  findAll() {
    return this.urlShortenerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.urlShortenerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUrlShortenerDto: UpdateUrlShortenerDto) {
    return this.urlShortenerService.update(+id, updateUrlShortenerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.urlShortenerService.remove(+id);
  }
}
