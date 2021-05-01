import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { GameMap } from './enums';
import { UtilityDataSchema, UtilityDataDocument } from './utility-data.schema';

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
  public utilities?: UtilityDataDocument[];
}

export type UtilityDocument = Utility & Document<mongoose.Schema.Types.ObjectId>;

export const UtilitySchema = SchemaFactory.createForClass(Utility);
