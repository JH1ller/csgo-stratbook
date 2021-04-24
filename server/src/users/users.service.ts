import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, UserDocument } from 'src/schemas/user.schema';

import { MailerService } from 'src/services/mail/mailer.service';
import { ResourceManagerService } from 'src/services/resource-manager/resource-manager.service';

/**
 * jwt encoded password reset data
 */
interface PasswordResetData {
  id: string;
}

/**
 * jwt encoded email confirmation data
 */
interface EmailConfirmationData {
  id: string;
}

interface EmailChangeData {
  id: string;

  email: string;
}

@Injectable()
export class UsersService {
  private readonly mailTokenSecret: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly resourceManagerService: ResourceManagerService
  ) {
    this.mailTokenSecret = this.configService.get<string>('mail.tokenSecret');
  }

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
      createdUser.emailConfirmed = true;
    } else {
      const token = this.signEmailConfirmRequest(createdUser.id);
      await this.mailerService.sendVerifyEmail(email, userName, token);
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

  public updateEmailConfirmed(id: Schema.Types.ObjectId, emailConfirmed: boolean) {
    return this.userModel.updateOne({ _id: id }, { emailConfirmed }).exec();
  }

  public async sendForgotPasswordRequest(user: UserDocument) {
    const data: PasswordResetData = {
      id: user._id.toString(),
    };

    const token = this.signJsonWebToken(data);

    const { email, userName } = user;
    await this.mailerService.sendPasswordResetMail(email, userName, token);
  }

  /**
   * verifies a user specified @param token and return its data
   * @param token jwt token
   * @returns jwt encoded email confirm data
   */
  public verifyEmailConfirmRequest(token: string) {
    return this.verifyJsonWebToken(token) as EmailConfirmationData;
  }

  public verifyForgotPasswordRequest(token: string) {
    return this.verifyJsonWebToken(token) as PasswordResetData;
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

  /**
   * removes all team members of the specified @param teamId
   * @param teamId team id
   */
  public removeTeamMembers(teamId: Schema.Types.ObjectId) {
    return this.userModel.updateMany({ team: teamId }, { team: null }).exec();
  }

  private signEmailConfirmRequest(userId: Schema.Types.ObjectId) {
    const data: EmailConfirmationData = {
      id: userId.toString(),
    };

    return this.signJsonWebToken(data);
  }

  private signEmailChangeRequest(userId: Schema.Types.ObjectId, email: string) {
    const data: EmailChangeData = {
      id: userId.toString(),
      email,
    };

    return this.signJsonWebToken(data);
  }

  private signJsonWebToken(data: Record<string, any>) {
    return jwt.sign(data, this.mailTokenSecret, { expiresIn: '30m' });
  }

  private verifyJsonWebToken(token: string) {
    const result = jwt.verify(token, this.mailTokenSecret);
    if (typeof result === 'string') {
      throw new Error('jwt content must be an object');
    }

    return result;
  }
}
