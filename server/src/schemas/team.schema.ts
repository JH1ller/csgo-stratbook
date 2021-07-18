import { Expose } from 'class-transformer';
import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class TeamServerConnection {
  @Expose()
  @ApiProperty()
  public ip?: string;

  @Expose()
  @ApiProperty()
  public password?: string;
}

@Schema({
  timestamps: {
    // https://mongoosejs.com/docs/guide.html#timestamps
    createdAt: 'createdAt',
    updatedAt: 'modifiedAt',
  },
})
export class Team {
  @Prop({
    required: true,
    maxlength: 24,
    minlength: 3,
  })
  public name: string;

  @Prop({
    maxlength: 300,
  })
  public website: string;

  @Prop(
    raw({
      ip: { type: String },
      password: { type: String },
    })
  )
  public server: TeamServerConnection;

  @Prop({
    required: true,
    unique: true,
  })
  public joinCode: string;

  @Prop()
  public avatar: string;

  /**
   * renamed from createdBy to owner
   */
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  public owner: Types.ObjectId;

  @Prop()
  public createdAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  public modifiedBy: Types.ObjectId;

  @Prop()
  public modifiedAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  public manager: Types.ObjectId;
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
