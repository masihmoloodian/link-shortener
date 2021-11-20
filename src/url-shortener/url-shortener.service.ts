import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { GetOriginalUrlDto } from './dto/get-original-url.dto';
import { Url } from './schema/url-shortener.schema'
@Injectable()
export class UrlShortenerService {
    constructor(
        @InjectModel('Url') private urlModel: Model<Url>,
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    // generate unique key
    private async generateKey(): Promise<string> {
        return Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 4);
    }

    // Add minutes to Date object
    private async addMinutes(minutes: number): Promise<Date> {
        const date = new Date()
        return new Date(date.getTime() + minutes * 60000);
    }

    // Create Short Link(alias for a url)
    async create(dto: CreateUrlShortenerDto): Promise<string> {
        if (!await this.checkUrlPattern(dto.original_url)) {
            throw new HttpException('Invalid url', 400)
        }
        if (dto.phone_number && !await this.checkIranianPhoneNumber(dto.phone_number)) {
            throw new HttpException('Invalid Iran phone number', 400)
        }

        // Check short_key is unique
        if (dto.short_key) {
            const found = await this.urlModel.findOne({ short_key: dto.short_key })
            if (found) {
                throw new HttpException('This URL is already associated', 403)
            }
        }
        let foundUser: User
        // If private url is set, we need to phone number for OTP validate
        if (dto.is_private) {
            if (!dto.phone_number) {
                throw new HttpException('Phone number is required', 400)
            }
            foundUser = await this.userService.getUserByPhoneNumber(dto.phone_number)
            if (!foundUser) {
                throw new HttpException('User not exists, For use private mode please register first', 404)
            }
        }

        /**
         * short_key: If user set short_key, we need to check it is unique, If not we generate new one
         * expire_at: If user set expire_at, url expires in that time otherwise it expires in default time
         * user_id: We save user_id for validate user for private urls
         */
        const createdUrl = new this.urlModel({
            original_url: dto.original_url,
            short_key: dto.short_key ? dto.short_key : await this.generateKey(),
            expire_at: dto.expire_date ? dto.expire_date : await this.addMinutes(+process.env.DEFAULT_EXPIRATION_TIME),
            is_private: dto.is_private,
            phone_number: dto.phone_number,
            user_id: foundUser ? foundUser._id : null
        });
        await createdUrl.save();
        // Return short link
        // eg. https://mylink.com/5d8f3e, https://mylink.com/url/5d8f3e
        return process.env.URL_SHORTENER_FULL_PATH + createdUrl.short_key
    }

    async getOriginalUrl(dto: GetOriginalUrlDto): Promise<string> {
        const found = await this.urlModel.findOne({ short_key: dto.short_key })
        if (!found) {
            throw new HttpException('Invalid short link', 404)
        }
        // If url is private, OTP validate is required
        if (found.is_private) {
            if (!dto.code) {
                throw new HttpException('This link is private, needs otp code', 401)
            }
            const isValid = await this.authService.validateOTPcode(dto.phone_number, dto.code)
            if (!isValid) {
                throw new HttpException('Invalid code', 401)
            }
        }
        // Increase one unit for each visit(Redirection)
        found.redirect_count++;

        await found.save();
        return found.original_url
    }

    async getShortLinkInfo(userId: string, shortKey: string) {
        const found = await this.urlModel.findOne({ short_key: shortKey })
        if (!found) {
            throw new HttpException('Invalid short link', 404)
        }
        // If is not private just return result
        if (found.user_id == null) {
            if (found.short_key == shortKey) return found
        }
        // If is private then check userID for authorize user
        if (found.user_id != userId) {
            throw new HttpException('You are not authorized to access this link', 401)
        }
        return found
    }

    private async checkUrlPattern(url: string): Promise<boolean> {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&%'\(\)\*\+,;=.]+$/gm
        return regex.test(url)
    }

    private async checkIranianPhoneNumber(phoneNumber: string): Promise<boolean> {
        const regex = /^(?:(?:09[1-9]\d{8})|(?:091[0-9]\d{7}))$/gm
        return regex.test(phoneNumber)
    }
}
