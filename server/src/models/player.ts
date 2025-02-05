import { Document, model, Schema, Types } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

import { AccessRole } from '@/types/enums';

export interface Player {
  name: string;
  email: string;
  password: string;
  confirmed: boolean;
  avatar: string;
  team?: Types.ObjectId;
  createdAt: Date;
  modifiedAt?: Date;
  isOnline: boolean;
  lastOnline?: Date;
  isAdmin: boolean;
  completedTutorial: boolean;
  color: string;
  steamId: string;
  accountType: 'local' | 'steam';
  role: AccessRole;
}

export type PlayerDocument = Player &
  Document<unknown, unknown, Player> & { _id: Types.ObjectId; $locals: { skipModified?: boolean } };

const playerSchema = new Schema<Player>({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 3,
  },

  email: {
    type: String,
    maxlength: 255,
    minlength: 6,
    unique: true,
    sparse: true,
  },

  password: {
    type: String,
    minlength: 8,
  },

  confirmed: {
    type: Boolean,
    default: false,
  },

  avatar: {
    type: String,
  },

  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  modifiedAt: {
    type: Date,
    default: Date.now,
  },

  isOnline: {
    type: Boolean,
  },

  lastOnline: {
    type: Date,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },

  completedTutorial: {
    type: Boolean,
    default: false,
  },

  color: String,

  steamId: {
    type: String,
    required: false,
  },

  accountType: {
    type: String,
    enum: ['local', 'steam'],
    default: 'local',
    required: true,
  },

  role: {
    type: String,
    enum: Object.values(AccessRole),
    default: AccessRole.EDITOR,
  },
});

playerSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true } } });

playerSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

playerSchema.pre('save', function (next) {
  if (this.isModified() && !this.$locals.skipModified) {
    this.modifiedAt = new Date();
  }
  next();
});

export const PlayerModel = model<Player>('Player', playerSchema);
