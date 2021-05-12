import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { GameMap } from './enums';
import { UtilityDataSchema, UtilityData } from './utility-data.schema';

/**
 * Utility schema
 * be careful, updating fields here as aggregation is uses on this schema
 */
@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'modifiedAt',
  },
})
export class Utility {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  public team: mongoose.Schema.Types.ObjectId;

  @Prop({
    enum: Object.values(GameMap),
    required: true,
  })
  public gameMap: string;

  @Prop({ type: [UtilityDataSchema] })
  public utilities: UtilityData[];
}

export type UtilityDocument = Utility & Document<mongoose.Schema.Types.ObjectId>;

export const UtilitySchema = SchemaFactory.createForClass(Utility);

// create compound index (team, gameMap)
UtilitySchema.index(
  {
    team: 1,
    gameMap: 1,
  },
  { unique: true }
);
