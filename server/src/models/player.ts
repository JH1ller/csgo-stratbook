import { Types, Schema, model, Document } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

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
}

export type PlayerDocument = Player &
  Document<unknown, any, Player> & { _id: Types.ObjectId; $locals: { skipModified?: boolean } };

const playerSchema = new Schema<Player>({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 3,
  },

  email: {
    type: String,
    unique: true,
    maxlength: 255,
    minlength: 6,
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
});

playerSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

playerSchema.pre('save', function (next) {
  if (this.isModified() && !this.$locals.skipModified) {
    this.modifiedAt = new Date();
  }
  next();
});

export const PlayerModel = model<Player>('Player', playerSchema);
