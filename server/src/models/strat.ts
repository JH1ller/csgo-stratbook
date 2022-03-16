import { Types, Schema, model, Document } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import { GameMap, StratSide, StratType } from '@/types/enums';

const arrNotEmpty = (value: unknown[]) => !!value.length;

export interface DrawBoardState {
  images: unknown[];
  lines: unknown[];
  texts: unknown[];
}

export interface Strat {
  name: string;
  map: GameMap;
  team: Types.ObjectId;
  side: StratSide;
  types: StratType[];
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
}

export type StratDocument = Document<unknown, any, Strat>;

const drawBoardStateSchema = new Schema<DrawBoardState>({
  images: [Object],
  lines: [Object],
  texts: [Object],
});

const stratSchema = new Schema<Strat>({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },

  map: {
    type: String,
    enum: ['DUST_2', 'MIRAGE', 'OVERPASS', 'NUKE', 'VERTIGO', 'INFERNO', 'TRAIN', 'ANCIENT'],
    required: true,
  },

  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },

  side: {
    type: String,
    enum: ['CT', 'T'],
    required: true,
  },

  types: {
    type: [String],
    default: [],
    validate: [arrNotEmpty, '{PATH} must have a length of >=1'],
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

  // TODO: revert to correct schema
  drawData: Schema.Types.Mixed,

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
});

stratSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

stratSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.modifiedAt = Date.now();
    if (this.$locals.playerId) this.modifiedBy = this.$locals.playerId;
  }
  next();
});

export const StratModel = model<Strat>('Strat', stratSchema);
