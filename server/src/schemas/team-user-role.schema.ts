import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TeamUserRole {
  /**
   * Member
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  public userId: Types.ObjectId;

  @Prop({ type: [String] })
  public role: string[];
}

export type TeamUserRoleDocument = TeamUserRole & Document;

export const TeamUserRoleSchema = SchemaFactory.createForClass(TeamUserRole);
