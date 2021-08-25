import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { PlayerSide } from './enums';
import { UtilityType, UtilityMouseButton, UtilityMovement } from './enums/utility';

@Schema({
  timestamps: true,
})
export class UtilityEntry {
  @Prop({ required: true })
  public name: string;

  @Prop({ maxlength: 200 })
  public description: string;

  @Prop({ maxlength: 300 })
  public videoLink: string;

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

  /**
   * display position for frontend
   */
  @Prop({ required: true })
  public displayPosition: number;

  @Prop({ type: [String] })
  public images: string[];

  @Prop({
    enum: Object.values(PlayerSide),
    required: true,
  })
  public side: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  public createdBy: Types.ObjectId;

  @Prop({ default: false })
  public shared: boolean;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

export type UtilityEntryDocument = UtilityEntry & Document<Types.ObjectId>;

export const UtilityEntrySchema = SchemaFactory.createForClass(UtilityEntry);
