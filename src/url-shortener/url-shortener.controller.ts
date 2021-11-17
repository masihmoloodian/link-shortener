import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query, UseGuards } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetOriginalUrlDto } from './dto/get-original-url.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { User } from 'src/shared/user.decorator';

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
  @Get()
  async getOriginalUrl(
    @Query() dto: GetOriginalUrlDto,
    @Res() res: any
  ) {
    const originalUrl = await this.urlShortenerService.getOriginalUrl(dto)
    return res.redirect(originalUrl);
  }

  @ApiOperation({ summary: 'Get a short link information' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('/info/:shortUrl')
  async getInfo(
    @User() user,
    @Param('shortUrl') shortUrl: string,
  ) {
    return await this.urlShortenerService.getShortLinkInfo(user.id, shortUrl)
  }
}
