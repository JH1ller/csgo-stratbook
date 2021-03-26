import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

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

  public userExists(email: string) {
    return this.userModel.exists({
      email,
    });
  }
}
