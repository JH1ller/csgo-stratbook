import { Types, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: {
    // https://mongoosejs.com/docs/guide.html#timestamps
    createdAt: 'createdAt',
    updatedAt: 'modifiedAt',
  },
})
export class User {
  @Prop({
    required: true,
    maxlength: 20,
    minlength: 3,
  })
  public userName: string;

  @Prop({
    required: true,
    unique: true,
    maxlength: 255,
    minlength: 6,
  })
  public email: string;

  @Prop({
    required: true,
    minlength: 8,
  })
  public password: string;

  @Prop({
    default: false,
  })
  public emailConfirmed: boolean;

  /**
   * s3 image bucket key
   */
  @Prop()
  public avatar?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Team',
  })
  public team?: Types.ObjectId;

  @Prop()
  public createdAt: Date;

  @Prop()
  public modifiedAt: Date;

  @Prop({
    default: () => Date.now(),
  })
  public lastOnline: Date;

  @Prop({
    default: false,
  })
  public isAdmin: boolean;

  @Prop({
    default: false,
  })
  public completedTutorial: boolean;
}

export type UserDocument = User & Document<Types.ObjectId>;

export const UserSchema = SchemaFactory.createForClass(User);
