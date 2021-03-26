import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Team } from './team.schema';
import { User } from './user.schema';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'modifiedAt',
  },
})
export class Utility {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    enum: ['FLASH', 'GRENADE', 'SMOKE', 'MOLOTOV'],
  })
  type: string;

  @Prop({
    enum: ['DUST_2', 'MIRAGE', 'OVERPASS', 'NUKE', 'VERTIGO', 'INFERNO', 'TRAIN'],
    required: true,
  })
  map: string;

  @Prop({
    required: true,
    enum: ['LEFT', 'RIGHT', 'LEFTRIGHT'],
  })
  mouseButton: string;

  @Prop({
    required: true,
    default: false,
  })
  crouch: boolean;

  @Prop({
    required: true,
    default: false,
  })
  jump: boolean;

  @Prop({
    enum: ['STILL', 'WALK', 'RUN'],
    required: true,
    default: 'STILL',
  })
  movement: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  team: Team;

  @Prop([String])
  images: [string];

  @Prop({
    maxlength: 200,
  })
  description: string;

  @Prop({
    enum: ['CT', 'T'],
    required: true,
  })
  side: string;

  @Prop()
  videoLink: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: User;

  @Prop()
  createdAt: Date;

  @Prop()
  modifiedAt: Date;

  @Prop({
    default: false,
  })
  shared: boolean;
}

export type UtilityDocument = Utility & Document;

export const UtilitySchema = SchemaFactory.createForClass(Utility);
