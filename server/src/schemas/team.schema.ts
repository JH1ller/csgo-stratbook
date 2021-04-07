import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { User } from './user.schema';

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
  name: string;

  @Prop({
    maxlength: 300,
  })
  website: string;

  @Prop(
    raw({
      ip: { type: String },
      password: { type: String },
    })
  )
  server: Record<string, any>;

  @Prop({
    required: true,
  })
  code: string;

  @Prop()
  avatar: string;

  /**
   * renamed from createdBy to owner
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop()
  createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  modifiedBy: User;

  @Prop()
  modifiedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  manager: User;
}

export type TeamDocument = Team & Document;

export const TeamSchema = SchemaFactory.createForClass(Team);

// teamSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });