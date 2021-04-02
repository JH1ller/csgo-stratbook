import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, hash } from 'bcrypt';

import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Find a user by email
   * @param email email of the corresponding account
   */
  public async findOne(email: string) {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  public async createUser(userName: string, email: string, password: string) {
    if (await this.isEmailInUse(email)) {
      throw new Error('email in use');
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const createdUser = new this.userModel({
      userName,
      email,
      password: hashedPassword,
    });

    return await createdUser.save();
  }

  public async isEmailInUse(email: string) {
    return await this.userModel.exists({
      email,
    });
  }
}
