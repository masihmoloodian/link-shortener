import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async signUp(dto: SignUpDto) {
    const foundUser = await this.userService.getUserByUsername(dto.username);
    if (foundUser) {
      throw new HttpException('User already exists', 403)
    }
    const userUrl = new this.userModel(dto);

    return await userUrl.save();
  }

  async signIn(dto: SignInDto) {
    const user = await this.userService.getUserByUsername(dto.username);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const isValid = await compare(dto.password, user.password);
    if (!isValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return await this.generateAccessToken(user);
  }

  private async generateAccessToken(user: User): Promise<Object> {
    console.log('>>1>>', user)
    const payload = { id: user._id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async getOTPcode(phonenumber: string) {

    const client = this.redisService.getClient(
      process.env.REDIS_REGISTER_NAME
    )
    const foundOTP = await client.get(`OTP-${phonenumber}`)
    if (foundOTP != null) {
      return foundOTP
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

  async validateOTPcode(phonenumber: string, OTPcode: number) {
    const client = this.redisService.getClient(
      process.env.REDIS_REGISTER_NAME
    )
    const foundOTP = await client.get(`OTP-${phonenumber}`)
    if (foundOTP === null) {
      throw new HttpException('OTP code expired', 404)
    }
    if (+foundOTP != OTPcode) {
      throw new HttpException('Invalid OTP code', 404)
    }
    await client.del(`OTP-${phonenumber}`)
    return true
  }

}

