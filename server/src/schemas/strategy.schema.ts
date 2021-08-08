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

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  public team: Types.ObjectId;

  @Prop({ type: [StrategyDataSchema] })
  public strategies: StrategyData[];
}

export type StrategyDocument = Strategy & Document<Types.ObjectId>;

export const StrategySchema = SchemaFactory.createForClass(Strategy);

// create compound index (team, gameMap)
StrategySchema.index(
  {
    team: 1,
    gameMap: 1,
  },
  { unique: true }
);
