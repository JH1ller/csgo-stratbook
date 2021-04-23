import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { User } from './user.schema';

export interface TeamServerConnection {
  ip?: string;
  password?: string;
}

@Schema({
  timestamps: {
    // https://mongoosejs.com/docs/guide.html#timestamps
    createdAt: 'createdAt',
    updatedAt: 'modifiedAt',
  },
})
export class Team {
  @Prop({
    required: true,
    maxlength: 24,
    minlength: 3,
  })
  public name: string;

  @Prop({
    maxlength: 300,
  })
  public website: string;

  @Prop(
    raw({
      ip: { type: String },
      password: { type: String },
    })
  )
  public server: TeamServerConnection;

  @Prop({
    required: true,
    unique: true,
  })
  public code: string;

  @Prop()
  public avatar: string;

  /**
   * renamed from createdBy to owner
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  public owner: User;

  @Prop()
  public createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  public modifiedBy: User;

  @Prop()
  public modifiedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  public manager: User;
}

export type TeamDocument = Team & Document;

export const TeamSchema = SchemaFactory.createForClass(Team);
