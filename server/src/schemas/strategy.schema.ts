import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

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
  public name: string;

  @Prop({
    required: true,
    enum: Object.values(GameMap),
  })
  public gameMap: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  public team: mongoose.Schema.Types.ObjectId;

  @Prop({
    enum: Object.values(PlayerSide),
    required: true,
  })
  public side: string;

  @Prop({
    enum: Object.values(StrategyType),
    default: StrategyType.BuyRound,
  })
  type: string;

  @Prop({
    default: true,
  })
  public active: boolean;

  @Prop({
    maxlength: 256,
  })
  public videoLink: string;

  @Prop({
    maxlength: 100,
  })
  public note: string;

  @Prop()
  public drawData: string;

  @Prop({
    default: '',
  })
  public content: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  public createdBy: mongoose.Schema.Types.ObjectId;

  @Prop()
  public createdAt: Date;

  @Prop()
  public modifiedAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  public modifiedBy: mongoose.Schema.Types.ObjectId;

  @Prop({
    default: false,
  })
  public shared: boolean;
}

export type StrategyDocument = Strategy & Document<mongoose.Schema.Types.ObjectId>;

export const StrategySchema = SchemaFactory.createForClass(Strategy);
