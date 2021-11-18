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
        if (dto.custom_name) {
            const found = await this.urlModel.findOne({ custom_name: dto.custom_name })
            if (found) {
                throw new HttpException('This URL is already associated', 406)
            }
        }
        let foundUser: User
        if (dto.is_private) {
            if (!dto.phone_number) {
                throw new HttpException('Phone number is required', 400)
            }
            foundUser = await this.userService.getUserByPhoneNumber(dto.phone_number)
            if (!foundUser) {
                throw new HttpException('User not exists, For use private mode please register first', 400)
            }
        }

        const createdUrl = new this.urlModel({
            original_url: dto.original_url,
            custom_name: dto.custom_name ? dto.custom_name : await this.generateKey(),
            expire_at: dto.expire_date ? dto.expire_date : await this.addMinutes(+process.env.DEFAULT_EXPIRATION_TIME),
            is_private: dto.is_private,
            phone_number: dto.phone_number,
            user_id: foundUser ? foundUser._id : null
        });
        await createdUrl.save();
        return process.env.URL_SHORTENER_FULL_PATH + createdUrl.custom_name
    }

    async getOriginalUrl(dto: GetOriginalUrlDto): Promise<string> {
        const found = await this.urlModel.findOne({ custom_name: dto.custom_name })
        if (!found) {
            throw new HttpException('Invalid short link', 404)
        }
        if (found.is_private) {
            if (!dto.code) {
                throw new HttpException('This link is private, needs otp code', 403)
            }
            const isValid = await this.authService.validateOTPcode(dto.phone_number, dto.code)
            if (!isValid) {
                throw new HttpException('Invalid code', 403)
            }
        }
        found.redirect_count++;
        await found.save();
        return found.original_url
    }

    async getShortLinkInfo(userId: string, customName: string) {
        const found = await this.urlModel.findOne({ custom_name: customName })
        if (!found) {
            throw new HttpException('Invalid short link', 404)
        }
        // If is not private just return result
        if (found.user_id == null) {
            if (found.custom_name == customName) return found
        }
        // If is priative then check userID for authorize user
        if (found.user_id != userId) {
            throw new HttpException('You are not authorized to access this link', 403)
        }
        return found
    }

    private async checkUrlPattern(url: string): Promise<boolean> {
        const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&%'\(\)\*\+,;=.]+$/gm
        return regex.test(url)
    }

}
