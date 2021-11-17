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

  async getUserByUsername(username: string): Promise<User> {
    return await this.urlModel.findOne({ username });
  }

  async getUserInfoById(id: string): Promise<User> {
    const user = await this.urlModel.findById(id);
    return user
  }

}
