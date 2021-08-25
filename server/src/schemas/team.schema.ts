import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Utility, UtilitySchema } from './utility.schema';
import { Strategy, StrategySchema } from './strategy.schema';
import { TeamUserRole, TeamUserRoleSchema } from './team-user-role.schema';

import { GameMap } from './enums';

@Schema({ timestamps: true })
export class Team {
  @Prop({
    required: true,
    maxlength: 24,
    minlength: 3,
  })
  public name: string;

  @Prop({ maxlength: 300 })
  public website?: string;

  @Prop({ maxlength: 128 })
  public serverIp?: string;

  @Prop({ maxlength: 128 })
  public serverPassword?: string;

  @Prop({
    required: true,
    unique: true,
  })
  public joinCode: string;

  /**
   * minio key
   */
  @Prop()
  public avatar?: string;

  /**
   * active maps which should be displayed in the app
   */
  @Prop({
    enum: Object.values(GameMap),
    default: [
      // current active map pool
      GameMap.Inferno,
      GameMap.Mirage,
      GameMap.Nuke,
      GameMap.Overpass,
      GameMap.Dust2,
      GameMap.Vertigo,
      GameMap.Ancient,
    ],
  })
  public activeMaps: string[];

  /**
   * user role descriptor
   */
  @Prop({ type: [TeamUserRoleSchema] })
  public roles: TeamUserRole[];

  /**
   * Game utilities
   */
  @Prop({ type: [UtilitySchema] })
  public utilities: Utility[];

  /**
   * Game strategies
   */
  @Prop({ type: [StrategySchema] })
  public strategies: Strategy[];

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  public modifiedBy: Types.ObjectId;
}

export type TeamDocument = Team & Document<Types.ObjectId>;

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index(
  {
    joinCode: 1,
  },
  {
    unique: true,
  }
);
