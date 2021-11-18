import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private urlModel: Model<User>) { }

  async getUserById(id: string): Promise<User> {
    return await this.urlModel.findById(id);
  }

  async getUserByUsername(userName: string): Promise<User> {
    return await this.urlModel.findOne({ user_name: userName });
  }

  async getUserInfoById(id: string): Promise<User> {
    return await this.urlModel.findById(id);
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<User> {
    return await this.urlModel.findOne({ phone_number: phoneNumber });
  }

}
