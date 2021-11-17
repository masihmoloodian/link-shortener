import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('u')
@Controller('u')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) { }

  @ApiOperation({ summary: 'Create shorter link, optional: [shortUrl, expire_date(default: 6 hour)]' })
  @Post()
  async create(@Body() dto: CreateUrlShortenerDto) {
    return this.urlShortenerService.create(dto);
  }

  @ApiOperation({ summary: 'Redirect to original url by short url' })
  @Get(':shortUrl')
  async getOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Res() res: any
  ) {
    const originalUrl = await this.urlShortenerService.getOriginalUrl(shortUrl)
    return res.redirect(originalUrl);
  }

  @ApiOperation({ summary: 'Get a short link information' })
  @Get('/info/:shortUrl')
  async getInfo(
    @Param('shortUrl') shortUrl: string,
  ) {
    return await this.urlShortenerService.getShortLinkInfo(shortUrl)
  }
}
