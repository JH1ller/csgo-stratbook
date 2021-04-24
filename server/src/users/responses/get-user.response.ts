import { Expose, Type } from 'class-transformer';
import { Schema } from 'mongoose';

import { GetTeamResponse } from 'src/teams/responses/get-team.response';

export class GetUserResponse {
  @Expose({ name: 'id' })
  @Type(() => String)
  public _id: Schema.Types.ObjectId;

  @Expose()
  public email: string;

  @Expose()
  public avatar: string;

  @Expose()
  @Type(() => GetTeamResponse)
  public team?: GetTeamResponse;

  @Expose()
  public completedTutorial: boolean;

  constructor(partial: Partial<GetUserResponse>) {
    Object.assign(this, partial);
  }
}
