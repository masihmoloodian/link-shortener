import { Module } from '@nestjs/common'
import { UrlShortenerService } from './url-shortener.service'
import { UrlShortenerController } from './url-shortener.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Url, UrlSchema } from './schema/url-shortener.schema'
import { AuthModule } from 'src/auth/auth.module'
import { UserModule } from 'src/user/user.module'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Url', schema: UrlSchema, }]),
		AuthModule,
		UserModule,
	],
	controllers: [UrlShortenerController],
	providers: [UrlShortenerService],
})
export class UrlShortenerModule { }
