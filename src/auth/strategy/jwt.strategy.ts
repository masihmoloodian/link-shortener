import { HttpException, Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from "src/user/schema/user.schema";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(
        payload: any,
        done: (error: any, result: any) => any
    ): Promise<User> {
        const user = await this.userService.getUserById(payload.id)
        if (user) return done(null, user)
        throw new HttpException('User not found!', 401)
    }
}