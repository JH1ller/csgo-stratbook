import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { GetTeamResponse } from 'src/teams/responses/get-team.response';

export class GetUserResponse {
  @Expose({ name: 'id' })
  @Type(() => String)
  @ApiProperty({ name: 'id', type: String })
  public _id: Types.ObjectId;

  @Expose()
  @ApiProperty()
  public email: string;

  @Expose()
  @ApiProperty()
  public avatar: string;

  @Expose()
  @Type(() => GetTeamResponse)
  @ApiProperty({ type: GetTeamResponse })
  public team?: GetTeamResponse;

  @Expose()
  @ApiProperty()
  public completedTutorial: boolean;

  constructor(partial: Partial<GetUserResponse>) {
    Object.assign(this, partial);
  }
}
