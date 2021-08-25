import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PlayerSide } from './enums';
import { StrategyType } from './enums/strategy';

@Schema({ timestamps: true })
export class StrategyData {
  @Prop({
    required: true,
    maxlength: 50,
  })
  public name: string;

  @Prop({
    enum: Object.values(PlayerSide),
    required: true,
  })
  public side: string;

  @Prop({
    type: [String],
    enum: Object.values(StrategyType),
    default: StrategyType.BuyRound,
  })
  public types: StrategyType[];

  @Prop({ default: true })
  public active: boolean;

  @Prop({ maxlength: 256 })
  public videoLink: string;

  @Prop({ default: false })
  public shared: boolean;

  /**
   * display position for frontend
   */
  @Prop({ required: true })
  public displayPosition: number;

  @Prop({ maxlength: 256 })
  public note: string;

  @Prop({ default: '' })
  public content: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  public modifiedBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  public createdBy: Types.ObjectId;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export type StrategyDataDocument = StrategyData & Document<Types.ObjectId>;

export const StrategyDataSchema = SchemaFactory.createForClass(StrategyData);
