import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class GetTeamResponse {
  @Expose({ name: 'id' })
  @Type(() => String)
  @ApiProperty({ name: 'id', type: String })
  public _id: Types.ObjectId;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty({ required: false })
  public website?: string;

  @Expose()
  @ApiProperty({ required: false })
  public serviceIp?: string;

  @Expose()
  @ApiProperty({ required: false })
  public serverPassword?: string;

  @Expose()
  @ApiProperty()
  public joinCode: string;

  @Expose()
  @ApiProperty({ required: false })
  public avatar: string;

  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  public manager: Types.ObjectId;

  constructor(partial: Partial<GetTeamResponse>) {
    Object.assign(this, partial);
  }
}
