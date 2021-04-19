import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Team } from './team.schema';

@Schema({
  timestamps: {
    // https://mongoosejs.com/docs/guide.html#timestamps
    createdAt: 'createdAt',
    updatedAt: 'modifiedAt',
  },
})
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

  @Prop({
    default: false,
  })
  public mailConfirmed: boolean;

  /**
   * s3 image bucket key
   */
  @Prop()
  public avatar?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  })
  public team?: Team;

  @Prop()
  public createdAt: Date;

  @Prop()
  public modifiedAt: Date;

  @Prop({
    default: () => Date.now(),
  })
  public lastOnline: Date;

  @Prop({
    default: false,
  })
  public isAdmin: boolean;

  @Prop({
    default: false,
  })
  public completedTutorial: boolean;
}

export type UserDocument = User & Document<mongoose.ObjectId>;

export const UserSchema = SchemaFactory.createForClass(User);
