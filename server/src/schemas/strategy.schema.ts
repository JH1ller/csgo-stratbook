import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Team } from './team.schema';
import { User } from './user.schema';

import { PlayerSide, GameMap } from './enums';
import { StrategyType } from './enums/strategy';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'modifiedAt',
  },
})
export class Strategy {
  @Prop({
    required: true,
    maxlength: 50,
  })
  name: string;

  @Prop({
    required: true,
    enum: Object.values(GameMap),
  })
  map: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  team: Team;

  @Prop({
    enum: Object.values(PlayerSide),
    required: true,
  })
  side: string;

  @Prop({
    enum: Object.values(StrategyType),
    default: StrategyType.BuyRound,
  })
  type: string;

  @Prop({
    default: true,
  })
  active: boolean;

  @Prop()
  videoLink: string;

  @Prop({
    maxlength: 100,
  })
  note: string;

  @Prop()
  drawData: string;

  @Prop({
    default: '',
  })
  content: string;

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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  modifiedBy: User;

  @Prop({
    default: false,
  })
  shared: boolean;
}

export type StrategyDocument = Strategy & Document;

export const StrategySchema = SchemaFactory.createForClass(Strategy);

// stratSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: true });
