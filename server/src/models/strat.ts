import { Document, model, Schema, Types } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

import { DrawBoardState } from '@/types';
import { GameMap, StratSide, StratType } from '@/types/enums';

const arrayNotEmpty = (value: unknown[]) => value.length > 0;

export interface Strat {
  _id: string;
  name: string;
  map: GameMap;
  team: Types.ObjectId;
  side: StratSide;
  types: StratType[];
  labels: string[];
  active: boolean;
  videoLink?: string;
  note?: string;
  drawData?: DrawBoardState;
  content?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  modifiedBy?: Types.ObjectId;
  modifiedAt?: Date;
  shared: boolean;
  index: number;
}

export type StratDocument = Document<Types.ObjectId, unknown, Strat>;

const drawBoardStateSchema = new Schema<DrawBoardState>({
  images: [Object],
  lines: [Object],
  texts: [Object],
  players: [Object],
});

const stratSchema = new Schema<Strat>({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },

  map: {
    type: String,
    enum: Object.values(GameMap),
    required: true,
  },

  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },

  side: {
    type: String,
    enum: Object.values(StratSide),
    required: true,
  },

  types: {
    type: [String],
    default: [],
    validate: [arrayNotEmpty, '{PATH} must have a length of >=1'],
  },

  labels: {
    type: [String],
    default: [],
  },

  active: {
    type: Boolean,
    default: true,
  },

  videoLink: {
    type: String,
  },

  note: {
    type: String,
    maxlength: 100,
  },

  drawData: drawBoardStateSchema,

  content: {
    type: String,
    default: '',
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

  shared: {
    type: Boolean,
    default: false,
  },

  index: {
    type: Number,
  },
});

stratSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

stratSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.modifiedAt = new Date();
    if (this.$locals.playerId) this.modifiedBy = this.$locals.playerId as Types.ObjectId;
  }
  next();
});

export const StratModel = model<Strat>('Strat', stratSchema);
