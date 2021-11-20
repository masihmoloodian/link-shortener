import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { RedisService } from 'nestjs-redis'
@Injectable()
export class AuthService {

  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) { }

  async signUp(dto: SignUpDto): Promise<User> {
    if (!await this.checkIranianPhoneNumber(dto.phone_number)) {
      throw new HttpException('Invalid Phone number', 400)
    }
    const foundUser = await this.userService.getUserByUsername(dto.user_name);
    if (foundUser) {
      let err: Array<string> = [];
      err.push('User already exists')
      if (foundUser.phone_number == dto.phone_number) {
        err.push('This phonenumber already exists')
      }
      throw new HttpException(err, 403)
    }

    const userUrl = new this.userModel(dto);

    return await userUrl.save();
  }

  async signIn(dto: SignInDto): Promise<Object> {
    const user = await this.userService.getUserByUsername(dto.username);
    if (!user) {
      throw new HttpException('Invalid username', 404);
    }
    const isValid = await compare(dto.password, user.password);
    if (!isValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    return await this.generateAccessToken(user);
  }

  private async generateAccessToken(user: User): Promise<object> {
    const payload = { id: user._id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async getOTPcode(phonenumber: string): Promise<number> {

    const foundUser = await this.userService.getUserByPhoneNumber(phonenumber);
    if (!foundUser) {
      throw new HttpException('User not exists, please register to use OTP', 404)
    }

    const client = this.redisService.getClient(
      process.env.REDIS_REGISTER_NAME
    )
    const foundOTP = await client.get(`OTP-${phonenumber}`)
    if (foundOTP != null) {
      return +foundOTP
    }

    const OTPcode = Math.floor(Math.random() * (999999 - 100000) + 100000);

    await client.set(
      `OTP-${phonenumber}`,
      OTPcode,
      'EX',
      process.env.REDIS_EXPIRE_TIME
    )
    return OTPcode
  }

  async validateOTPcode(phonenumber: string, OTPcode: number): Promise<boolean> {
    const foundUser = await this.userService.getUserByPhoneNumber(phonenumber);
    if (!foundUser) {
      throw new HttpException('Wrong phone number', 400)
    }

    const client = this.redisService.getClient(
      process.env.REDIS_REGISTER_NAME
    )
    const foundOTP = await client.get(`OTP-${phonenumber}`)
    if (foundOTP === null) {
      throw new HttpException('OTP code expired', 401)
    }

    if (+foundOTP != OTPcode) {
      throw new HttpException('Invalid OTP code', 401)
    }

    await client.del(`OTP-${phonenumber}`)
    return true
  }

  private async checkIranianPhoneNumber(phoneNumber: string): Promise<boolean> {
    const regex = /^(?:(?:09[1-9]\d{8})|(?:091[0-9]\d{7}))$/gm
    return regex.test(phoneNumber)
  }

}

