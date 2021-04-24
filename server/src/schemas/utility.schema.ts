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
  public name: string;

  @Prop({
    required: true,
    enum: Object.values(UtilityType),
  })
  public type: string;

  @Prop({
    enum: Object.values(GameMap),
    required: true,
  })
  public gameMap: string;

  @Prop({
    required: true,
    enum: Object.values(UtilityMouseButton),
  })
  public mouseButton: string;

  @Prop({
    required: true,
    default: false,
  })
  public crouch: boolean;

  @Prop({
    required: true,
    default: false,
  })
  public jump: boolean;

  @Prop({
    enum: Object.values(UtilityMovement),
    required: true,
    default: UtilityMovement.Still,
  })
  public movement: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  public team: Team;

  @Prop({
    type: [String],
  })
  public images: string[];

  @Prop({
    maxlength: 200,
  })
  public description: string;

  @Prop({
    enum: Object.values(PlayerSide),
    required: true,
  })
  public side: string;

  @Prop({
    maxlength: 300,
  })
  public videoLink: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  public createdBy: User;

  @Prop()
  public createdAt: Date;

  @Prop()
  public modifiedAt: Date;

  @Prop({
    default: false,
  })
  public shared: boolean;
}

export type UtilityDocument = Utility & Document;

export const UtilitySchema = SchemaFactory.createForClass(Utility);
