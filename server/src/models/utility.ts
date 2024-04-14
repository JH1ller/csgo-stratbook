import { Types, Schema, model, Document } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import { GameMap, MouseButton, Movement, StratSide, UtilityType } from '@/types/enums';

export interface Utility {
  name: string;
  type: UtilityType;
  map: GameMap;
  mouseButton: MouseButton;
  crouch: boolean;
  jump: boolean;
  movement: Movement;
  team: Types.ObjectId;
  images: string[];
  description?: string;
  side: StratSide;
  videoLink?: string;
  setpos?: string;
  labels: string[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  shared: boolean;
  deleted: boolean;
  deletedAt?: Date;
}

export type UtilityDocument = Document<unknown, any, Utility>;

const utilitySchema = new Schema<Utility>({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
    enum: ['FLASH', 'GRENADE', 'SMOKE', 'MOLOTOV'],
  },

  map: {
    type: String,
    enum: ['DUST_2', 'MIRAGE', 'OVERPASS', 'NUKE', 'VERTIGO', 'INFERNO', 'TRAIN', 'ANCIENT', 'ANUBIS'],
    required: true,
  },

  mouseButton: {
    type: String,
    required: true,
    enum: ['LEFT', 'RIGHT', 'LEFTRIGHT'],
  },

  crouch: {
    type: Boolean,
    required: true,
    default: false,
  },

  jump: {
    type: Boolean,
    required: true,
    default: false,
  },

  movement: {
    type: String,
    enum: ['STILL', 'WALK', 'RUN'],
    required: true,
  },

  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },

  images: {
    type: [String],
    default: [],
  },

  description: {
    type: String,
    maxlength: 200,
  },

  side: {
    type: String,
    enum: ['CT', 'T'],
    required: true,
  },

  videoLink: {
    type: String,
  },

  setpos: {
    type: String,
  },

  labels: {
    type: [String],
    default: [],
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

  shared: {
    type: Boolean,
    default: false,
  },
});

utilitySchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });

export const UtilityModel = model<Utility>('Utility', utilitySchema);
