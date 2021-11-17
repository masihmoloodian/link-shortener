import { Module } from '@nestjs/common'
import { UrlShortenerService } from './url-shortener.service'
import { UrlShortenerController } from './url-shortener.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Url, UrlSchema } from './schema/url-shortener.schema'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Url', schema: UrlSchema, }]),
	],
	controllers: [UrlShortenerController],
	providers: [UrlShortenerService],
})
export class UrlShortenerModule { }
