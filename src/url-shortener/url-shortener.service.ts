import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { Url } from './schema/url-shortener.schema'
@Injectable()
export class UrlShortenerService {
    // constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) { }
    constructor(@InjectModel('Url') private urlModel: Model<Url>) { }

    // generate unique key
    private async generateKey() {
        Math.random().toString(36).substring(2, 15)
        return Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 4);
    }

    // Add minutes to Date object
    private async addMinutes(minutes: number) {
        const date = new Date()
        return new Date(date.getTime() + minutes * 60000);
    }

    async create(dto: CreateUrlShortenerDto) {
        if (!await this.checkUrlPattern(dto.originalUrl)) {
            throw new HttpException('Invalid url', 400)
        }
        if (dto.shortUrl) {
            const found = await this.urlModel.findOne({ shortUrl: dto.shortUrl })
            if (found) {
                throw new HttpException('This URL is already associated', 406)
            }
        }

        const createdUrl = new this.urlModel({
            originalUrl: dto.originalUrl,
            shortUrl: dto.shortUrl ? dto.shortUrl : await this.generateKey(),
            expireAt: dto.expire_date ? dto.expire_date : await this.addMinutes(+process.env.DEFAULT_EXPIRATION_TIME)
        });
        await createdUrl.save();
        return process.env.URL_SHORTENER_FULL_PATH + createdUrl.shortUrl
    }

    async getOriginalUrl(shortUrl: string) {
        const found = await this.urlModel.findOne({ shortUrl })
        if (!found) {
            throw new HttpException('Invalid short link', 404)
        }
        found.redirectCount++;
        await found.save();
        return found.originalUrl
    }

    async getShortLinkInfo(shortUrl: string) {
        const found = await this.urlModel.findOne({ shortUrl })
        if (!found) {
            throw new HttpException('Invalid short link', 404)
        }
        return found
    }

    // check url pattern
    private async checkUrlPattern(url: string) {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&%'\(\)\*\+,;=.]+$/gm
        return regex.test(url)
    }

}
