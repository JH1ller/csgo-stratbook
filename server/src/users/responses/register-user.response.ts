import { Expose, Type } from 'class-transformer';
import { Schema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserResponse {
  @Expose({ name: 'id' })
  @Type(() => String)
  @ApiProperty({ name: 'id', type: String })
  public _id: Schema.Types.ObjectId;

  @Expose()
  @ApiProperty()
  public email: string;

  constructor(partial: Partial<RegisterUserResponse>) {
    Object.assign(this, partial);
  }
}
