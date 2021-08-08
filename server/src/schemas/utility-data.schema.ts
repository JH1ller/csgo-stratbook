import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PlayerSide } from './enums';
import { UtilityType, UtilityMouseButton, UtilityMovement } from './enums/utility';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'modifiedAt',
  },
})
export class UtilityData {
  /**
   * display position for frontend
   */
  @Prop({ required: true })
  public displayPosition: number;

  @Prop({ required: true })
  public name: string;

  @Prop({
    required: true,
    enum: Object.values(UtilityType),
  })
  public type: string;

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

  @Prop({ type: [String] })
  public images: string[];

  @Prop({ maxlength: 200 })
  public description: string;

  @Prop({
    enum: Object.values(PlayerSide),
    required: true,
  })
  public side: string;

  @Prop({ maxlength: 300 })
  public videoLink: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  public createdBy: Types.ObjectId;

  @Prop()
  public createdAt: Date;

  @Prop()
  public modifiedAt: Date;

  @Prop({ default: false })
  public shared: boolean;
}

export type UtilityDataDocument = UtilityData & Document<Types.ObjectId>;

export const UtilityDataSchema = SchemaFactory.createForClass(UtilityData);
