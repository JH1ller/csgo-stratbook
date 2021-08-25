import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { GameMap } from './enums';
import { UtilityEntrySchema, UtilityEntry } from './utility-entry.schema';

/**
 * Utility schema
 * be careful, updating fields here as aggregation is uses on this schema
 */
@Schema()
export class Utility {
  @Prop({
    enum: Object.values(GameMap),
    required: true,
  })
  public gameMap: string;

  @Prop({ type: [UtilityEntrySchema] })
  public utilities: UtilityEntry[];
}

export type UtilityDocument = Utility & Document<Types.ObjectId>;

export const UtilitySchema = SchemaFactory.createForClass(Utility);
