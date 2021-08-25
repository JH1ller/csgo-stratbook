import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { UserRole } from './enums/user-role';

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    maxlength: 20,
    minlength: 3,
  })
  public userName: string;

  @Prop({
    required: true,
    unique: true,
    maxlength: 255,
    minlength: 6,
  })
  public email: string;

  @Prop({
    required: true,
    minlength: 8,
  })
  public password: string;

  @Prop({ default: false })
  public emailConfirmed: boolean;

  /**
   * minio image bucket key
   */
  @Prop()
  public avatar?: string;

  /**
   * user roles used for policy based authorization
   */
  @Prop({ type: [String] })
  public roles: UserRole[];

  /**
   * optional ref to joined team
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  public team?: Types.ObjectId;

  @Prop({ default: false })
  public completedTutorial: boolean;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;

  @Prop({ default: () => Date.now() })
  public lastOnline: Date;
}

export type UserDocument = User & Document<Types.ObjectId>;

export const UserSchema = SchemaFactory.createForClass(User);
