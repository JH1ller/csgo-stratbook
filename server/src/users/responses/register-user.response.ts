import { Expose, Type } from 'class-transformer';
import { Schema } from 'mongoose';

export class RegisterUserResponse {
  @Expose({ name: 'id' })
  @Type(() => String)
  public _id: Schema.Types.ObjectId;

  @Expose()
  public email: string;

  constructor(partial: Partial<RegisterUserResponse>) {
    Object.assign(this, partial);
  }
}
