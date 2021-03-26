import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { Team } from './team.schema';
import { User } from './user.schema';

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
    enum: ['DUST_2', 'MIRAGE', 'OVERPASS', 'NUKE', 'VERTIGO', 'INFERNO', 'TRAIN'],
  })
  map: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  })
  team: Team;

  @Prop({
    enum: ['CT', 'T'],
    required: true,
  })
  side: string;

  @Prop({
    enum: ['PISTOL', 'FORCE', 'BUYROUND'],
    default: 'BUYROUND',
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
