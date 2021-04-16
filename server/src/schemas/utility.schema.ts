import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Team } from './team.schema';
import { User } from './user.schema';

import { PlayerSide, GameMap } from './enums';
import { UtilityType, UtilityMouseButton, UtilityMovement } from './enums/utility';

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
    enum: Object.values(UtilityType),
  })
  type: string;

  @Prop({
    enum: Object.values(GameMap),
    required: true,
  })
  map: string;

  @Prop({
    required: true,
    enum: Object.values(UtilityMouseButton),
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
    enum: Object.values(UtilityMovement),
    required: true,
    default: UtilityMovement.Still,
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
    enum: Object.values(PlayerSide),
    required: true,
  })
  side: string;

  @Prop({
    maxlength: 300,
  })
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
