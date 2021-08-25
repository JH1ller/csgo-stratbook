import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

import { GameMap } from './enums';
import { StrategyData, StrategyDataSchema } from './strategy-data.schema';

@Schema()
export class Strategy {
  @Prop({
    required: true,
    enum: Object.values(GameMap),
  })
  public gameMap: string;

  @Prop({ type: [StrategyDataSchema] })
  public strategies: StrategyData[];
}

export type StrategyDocument = Strategy & Document<Types.ObjectId>;

export const StrategySchema = SchemaFactory.createForClass(Strategy);
