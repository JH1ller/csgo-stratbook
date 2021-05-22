import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { TeamServerConnection } from 'src/schemas/team.schema';

export class GetTeamResponse {
  @Expose({ name: 'id' })
  @Type(() => String)
  @ApiProperty({ name: 'id', type: String })
  public _id: Types.ObjectId;

  @Expose()
  @ApiProperty()
  public name: string;

  @Expose()
  @ApiProperty()
  public website: string;

  @Expose()
  @Type(() => TeamServerConnection)
  @ApiProperty()
  public server: TeamServerConnection;

  @Expose()
  @ApiProperty()
  public code: string;

  @Expose()
  @ApiProperty()
  public avatar: string;

  @Expose()
  @Type(() => String)
  @ApiProperty({ type: String })
  public manager: Types.ObjectId;

  constructor(partial: Partial<GetTeamResponse>) {
    Object.assign(this, partial);
  }
}
