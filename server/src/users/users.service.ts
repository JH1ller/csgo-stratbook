import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';

import { Types, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User, UserDocument } from 'src/schemas/user.schema';

import { MailerService } from 'src/services/mail/mailer.service';
import { MinioService } from 'src/services/minio/minio-service.service';

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

  private readonly createUserWithConfirmedMail: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
    private readonly minioService: MinioService
  ) {
    this.mailTokenSecret = this.configService.get<string>('mail.tokenSecret');
    this.createUserWithConfirmedMail = configService.get<boolean>('debug.createUserWithConfirmedMail');
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

  public existsById(id: Types.ObjectId) {
    return this.userModel.exists({ _id: id });
  }

  public existsByEmail(email: string) {
    return this.userModel.exists({
      email,
    });
  }

  /**
   * Creates a new user
   * @param userName userName
   * @param email user email
   * @param password non hashed password
   * @param avatar url to minio storage
   * @returns user document id
   */
  public async createUser(userName: string, email: string, password: string) {
    const hashedPassword = await this.hashPassword(password);

    const createdUser = new this.userModel({
      userName,
      email,
      password: hashedPassword,
    });

    if (this.createUserWithConfirmedMail) {
      createdUser.emailConfirmed = true;
    }

    const { _id } = await createdUser.save();
    return _id;
  }

  public async deleteUser(id: Types.ObjectId) {
    const user = await this.userModel.findByIdAndDelete(id);

    // delete avatar from minio bucket
    if (user.avatar) {
      await this.minioService.deleteImage(user.avatar);
    }
  }

  /**
   * Updates the password field on a user document.
   * @param id user document id
   * @param password new password
   * @returns query promise
   */
  public async updatePassword(id: Types.ObjectId, password: string) {
    const hashedPassword = await this.hashPassword(password);

    return await this.userModel.updateOne({ _id: id }, { password: hashedPassword }).exec();
  }

  public updateEmailAddress(id: Types.ObjectId, email: string) {
    return this.userModel.updateOne({ _id: id }, { email }).exec();
  }

  public updateCompletedTutorial(id: Types.ObjectId, completedTutorial: boolean) {
    return this.userModel.updateOne({ _id: id }, { completedTutorial }).exec();
  }

  public updateEmailConfirmed(id: Types.ObjectId, emailConfirmed: boolean) {
    return this.userModel.updateOne({ _id: id }, { emailConfirmed }).exec();
  }

  public updateUser(id: Types.ObjectId, userData: Partial<User>) {
    return this.userModel.updateOne({ _id: id }, userData).exec();
  }

  public async updateAvatar(id: Types.ObjectId, avatar: string) {
    await this.userModel.updateOne({ _id: id }, { avatar }).exec();
  }

  public async sendVerifyEmailRequest(id: Types.ObjectId, email: string, userName: string) {
    const data: EmailConfirmationData = {
      id: id.toString(),
    };

    const token = this.signJsonWebToken(data);
    await this.mailerService.sendVerifyEmail(email, userName, token);

    return token;
  }

  /**
   * Sends password request email to the specified user
   * @param user user document
   * @returns generated jwt payload
   */
  public async sendForgotPasswordRequest(user: UserDocument) {
    const data: PasswordResetData = {
      id: user._id.toString(),
    };

    const token = this.signJsonWebToken(data);

    const { email, userName } = user;
    await this.mailerService.sendPasswordResetMail(email, userName, token);

    return token;
  }

  public async sendEmailChangeRequest(user: UserDocument, email: string) {
    const data: EmailChangeData = {
      id: user._id.toString(),
      email,
    };

    const token = this.signJsonWebToken(data);
    await this.mailerService.sendVerifyNewEmailRequest(email, user.userName, token);

    return token;
  }

  /**
   * verifies a user specified @name token and return its data
   * @param token jwt token
   * @returns jwt encoded email confirm data
   */
  public verifyEmailConfirmRequest(token: string) {
    return this.verifyJsonWebToken(token) as EmailConfirmationData;
  }

  public verifyForgotPasswordRequest(token: string) {
    return this.verifyJsonWebToken(token) as PasswordResetData;
  }

  public verifyEmailChangeRequest(token: string) {
    return this.verifyJsonWebToken(token) as EmailChangeData;
  }

  /**
   * Assigns the @name teamId to the user specified @name id
   * @param id userId
   * @param teamId teamId
   */
  public assignTeam(userId: Types.ObjectId, teamId: Types.ObjectId | null) {
    return this.userModel.updateOne({ _id: userId }, { team: teamId }).exec();
  }

  public async getTeamMembers(teamId: Types.ObjectId) {
    return this.userModel
      .find({
        team: teamId,
      })
      .exec();
  }

  public async getTeamMemberCount(teamId: Types.ObjectId) {
    return this.userModel
      .count({
        team: teamId,
      })
      .exec();
  }

  public unassignTeam(userId: Types.ObjectId) {
    return this.assignTeam(userId, null);
  }

  /**
   * removes all team members of the specified @name teamId
   * @param teamId team id
   */
  public removeTeamMembers(teamId: Types.ObjectId) {
    return this.userModel.updateMany({ team: teamId }, { team: null }).exec();
  }

  public async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
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
