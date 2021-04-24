import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, UserDocument } from 'src/schemas/user.schema';

import { MailerService } from 'src/services/mail/mailer.service';
import { ResourceManagerService } from 'src/services/resource-manager/resource-manager.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly resourceManagerService: ResourceManagerService
  ) {}

  /**
   * Find user by document id
   * @param id user document id
   */
  public findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  /**
   * Find a user by email
   * @param email email of the corresponding account
   */
  public findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  public existsById(id: Schema.Types.ObjectId) {
    return this.userModel.exists({ _id: id });
  }

  public existsByEmail(email: string) {
    return this.userModel.exists({
      email,
    });
  }

  public async createUser(userName: string, email: string, password: string, avatar?: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createdUser = new this.userModel({
      userName,
      email,
      password: hashedPassword,
      avatar,
    });

    if (this.configService.get<boolean>('debug.createUserWithConfirmedMail')) {
      createdUser.mailConfirmed = true;
    }

    return await createdUser.save();
  }

  public async deleteUser(id: Schema.Types.ObjectId) {
    const user = await this.userModel.findByIdAndDelete(id);

    // delete avatar from S3
    if (user.avatar) {
      await this.resourceManagerService.deleteImage(user.avatar);
    }
  }

  /**
   * Updates the password field on a user document.
   * @param id user document id
   * @param newPassword new password
   * @returns query promise
   */
  public async updatePassword(id: Schema.Types.ObjectId, newPassword: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    return await this.userModel.updateOne({ _id: id }, { password: hashedPassword }).exec();
  }

  public updateUserName(id: Schema.Types.ObjectId, userName: string) {
    return this.userModel.updateOne({ _id: id }, { userName }).exec();
  }

  public updateCompletedTutorial(id: Schema.Types.ObjectId, completedTutorial: boolean) {
    return this.userModel.updateOne({ _id: id }, { completedTutorial }).exec();
  }

  public async sendForgotPasswordRequest(user: UserDocument) {
    const tokenSecret = this.configService.get<string>('mail.tokenSecret');

    const data = {
      _id: user._id,
    };

    const token = jwt.sign(data, tokenSecret, { expiresIn: '30m' });

    const { email, userName } = user;
    await this.mailerService.sendPasswordResetMail(email, userName, token);
  }

  /**
   * Assigns the @param teamId to the user specified @param id
   * @param id userId
   * @param teamId teamId
   */
  public setTeam(userId: Schema.Types.ObjectId, teamId: Schema.Types.ObjectId | null) {
    return this.userModel
      .updateOne({
        _id: userId,
        team: teamId,
      })
      .exec();
  }

  public async getTeamMembers(teamId: Schema.Types.ObjectId) {
    return this.userModel
      .find({
        team: teamId,
      })
      .exec();
  }

  public async getTeamMemberCount(teamId: Schema.Types.ObjectId) {
    return this.userModel
      .count({
        team: teamId,
      })
      .exec();
  }

  public leaveTeam(userId: Schema.Types.ObjectId) {
    return this.setTeam(userId, null);
  }

  public removeTeamMembers(teamId: Schema.Types.ObjectId) {
    return this.userModel.updateMany({ team: teamId }, { team: null }).exec();
  }
}
