import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { PlayerSide } from 'src/schemas/enums';
import { UtilityType, UtilityMouseButton, UtilityMovement } from 'src/schemas/enums/utility';

export class GetUtilityCratedByResponse {
  @Expose()
  @ApiProperty()
  public readonly userName: string;
}

export class GetUtilityResponse {
  @Expose({ name: 'id' })
  @Type(() => String)
  @ApiProperty({ name: 'id', type: String })
  public readonly _id: Types.ObjectId;

  @Expose()
  @ApiProperty()
  public readonly name: string;

  @Expose()
  @ApiProperty()
  public readonly description: string;

  @Expose()
  @ApiProperty({ enum: PlayerSide, enumName: 'PlayerSide' })
  public readonly playerSide: PlayerSide;

  @Expose()
  @ApiProperty({ enum: UtilityType, enumName: 'UtilityType' })
  public readonly type: UtilityType;

  @Expose()
  @ApiProperty({ enum: UtilityMouseButton, enumName: 'UtilityMouseButton' })
  public readonly mouseButton: UtilityMouseButton;

  @Expose()
  @ApiProperty()
  public readonly crouch: boolean;

  @Expose()
  @ApiProperty()
  public readonly jump: boolean;

  @Expose()
  @ApiProperty({ enum: UtilityMovement, enumName: 'UtilityMovement' })
  public readonly movement: UtilityMovement;

  @Expose()
  @ApiProperty()
  public readonly images: string[];

  @Expose()
  @ApiProperty()
  public readonly videoLink: string;

  @Expose()
  @Type(() => GetUtilityCratedByResponse)
  @ApiProperty({ type: GetUtilityCratedByResponse })
  public readonly createdBy: GetUtilityCratedByResponse;

  @Expose()
  @ApiProperty()
  public readonly createdAt: Date;

  constructor(partial: Partial<GetUtilityResponse>) {
    Object.assign(this, partial);
  }
}
