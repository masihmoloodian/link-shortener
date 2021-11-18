import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { GetOriginalUrlDto } from './dto/get-original-url.dto';
import { Url } from './schema/url-shortener.schema'
@Injectable()
export class UrlShortenerService {
    // constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) { }
    constructor(
        @InjectModel('Url') private urlModel: Model<Url>,
        private readonly authService: AuthService,
        private readonly userService: UserService

    ) { }

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
        if (dto.customName) {
            const found = await this.urlModel.findOne({ shortUrl: dto.customName })
            if (found) {
                throw new HttpException('This URL is already associated', 406)
            }
        }
        let foundUser
        if (dto.is_private) {
            if (!dto.phonenumber) {
                throw new HttpException('Phone number is required', 400)
            }
            foundUser = await this.userService.getUserByPhoneNumber(dto.phonenumber)
        }

        const createdUrl = new this.urlModel({
            originalUrl: dto.originalUrl,
            shortUrl: dto.customName ? dto.customName : await this.generateKey(),
            expireAt: dto.expire_date ? dto.expire_date : await this.addMinutes(+process.env.DEFAULT_EXPIRATION_TIME),
            is_private: dto.is_private,
            phonenumber: dto.phonenumber,
            userId: foundUser._id
        });
        await createdUrl.save();
        return process.env.URL_SHORTENER_FULL_PATH + createdUrl.customName
    }

    async getOriginalUrl(dto: GetOriginalUrlDto) {
        const found = await this.urlModel.findOne({ shortUrl: dto.customName })
        if (!found) {
            throw new HttpException('Invalid short link', 404)
        }
        if (found.is_private) {
            if (!dto.code) {
                throw new HttpException('This link is private, needs otp code', 403)
            }
            const validCode = await this.authService.validateOTPcode(dto.phonenumber, dto.code)
            if (!validCode) {
                throw new HttpException('Invalid code', 403)
            }
        }
        found.redirectCount++;
        await found.save();
        return found.originalUrl
    }

    async getShortLinkInfo(userId: string, shortUrl: string) {
        const found = await this.urlModel.findOne({ shortUrl })
        if (!found) {
            throw new HttpException('Invalid short link', 404)
        }
        if (found.userId != userId) {
            throw new HttpException('You are not authorized to access this link', 403)
        }
        return found
    }

    // check url pattern
    private async checkUrlPattern(url: string) {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&%'\(\)\*\+,;=.]+$/gm
        return regex.test(url)
    }

}
