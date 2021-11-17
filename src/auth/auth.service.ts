import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/signIn.dto';
import { SignUpDto } from './dto/signUp.dto';
import { compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'




@Injectable()
export class AuthService {

  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,

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
}
