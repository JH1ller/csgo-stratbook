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
  userName: string;

  @Prop({
    required: true,
    unique: true,
    maxlength: 255,
    minlength: 6,
  })
  email: string;

  @Prop({
    required: true,
    minlength: 8,
  })
  password: string;

  @Prop({
    default: false,
  })
  mailConfirmed: boolean;

  @Prop()
  avatar: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  })
  team: Team;

  @Prop()
  createdAt: Date;

  @Prop()
  modifiedAt: Date;

  @Prop()
  isOnline: boolean;

  @Prop({
    default: () => Date.now(),
  })
  lastOnline: Date;

  @Prop({
    default: false,
  })
  isAdmin: boolean;

  @Prop({
    default: false,
  })
  completedTutorial: boolean;
}

export type UserDocument = User & Document<mongoose.ObjectId>;

export const UserSchema = SchemaFactory.createForClass(User);
// UserSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
