import { Schema, Types, model, Document } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

export interface Team {
  name: string;
  website?: string;
  server?: {
    ip?: string;
    password?: string;
  };
  code: string;
  avatar?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  modifiedBy?: Types.ObjectId;
  modifiedAt?: Date;
  manager: Types.ObjectId;
  deleted: boolean;
  deletedAt?: Date;
}

export type TeamDocument = Team &
  Document<unknown, any, Team> & { _id: Types.ObjectId; $locals: { skipModified?: boolean } };

const teamSchema = new Schema<Team>({
  name: {
    type: String,
    required: true,
    maxlength: 24,
    minlength: 3,
  },

  website: {
    type: String,
    maxlength: 300,
  },

  server: {
    type: {
      ip: String,
      password: String,
    },
  },

  code: {
    type: String,
    required: true,
  },

  avatar: {
    type: String,
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },

  modifiedBy: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },

  modifiedAt: {
    type: Date,
    default: Date.now,
  },

  manager: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
});

teamSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

teamSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.modifiedAt = new Date();
  }
  next();
});

export const TeamModel = model<Team>('Team', teamSchema);
