import { Expose, Type } from 'class-transformer';
import { Schema } from 'mongoose';

import { TeamServerConnection } from 'src/schemas/team.schema';

export class GetTeamResponse {
  @Expose({ name: 'id' })
  @Type(() => String)
  public _id: Schema.Types.ObjectId;

  @Expose()
  public name: string;

  @Expose()
  public website: string;

  @Expose()
  @Type(() => TeamServerConnection)
  public server: TeamServerConnection;

  @Expose()
  public code: string;

  @Expose()
  public avatar: string;

  @Expose()
  @Type(() => String)
  public manager: Schema.Types.ObjectId;

  constructor(partial: Partial<GetTeamResponse>) {
    Object.assign(this, partial);
  }
}
