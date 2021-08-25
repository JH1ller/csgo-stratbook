import { Expose, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { PlayerSide } from 'src/schemas/enums';
import { StrategyType } from 'src/schemas/enums/strategy';

export class StrategyItemUserResponse {
  @Expose()
  @ApiProperty()
  public readonly userName: string;

  public constructor(partial: Partial<StrategyItemUserResponse>) {
    Object.assign(this, partial);
  }
}

export class StrategyItemResponse {
  @Expose({ name: 'id' })
  @Type(() => String)
  @ApiProperty({ name: 'id', type: String })
  public readonly _id: Types.ObjectId;

  @Expose()
  @ApiProperty()
  public readonly name: string;

  @Expose()
  @ApiProperty()
  public readonly note: string;

  @Expose()
  @ApiProperty({ enum: PlayerSide, enumName: 'PlayerSide' })
  public readonly side: PlayerSide;

  @Expose()
  @ApiProperty({ enum: StrategyType, enumName: 'StrategyType' })
  public readonly strategyType: StrategyType;

  @Expose()
  @ApiProperty()
  public readonly active: boolean;

  @Expose()
  @ApiProperty()
  public readonly videoLink: string;

  @Expose()
  @ApiProperty()
  public readonly shared: boolean;

  @Expose()
  @ApiProperty()
  public readonly content: string;

  @Expose()
  @Type(() => StrategyItemUserResponse)
  @ApiProperty({ type: StrategyItemUserResponse })
  public readonly modifiedBy: StrategyItemUserResponse;

  @Expose()
  @Type(() => StrategyItemUserResponse)
  @ApiProperty({ type: StrategyItemUserResponse })
  public readonly createdBy: StrategyItemUserResponse;

  @Expose()
  @ApiProperty()
  public readonly createdAt: Date;

  @Expose()
  @ApiProperty()
  public readonly updatedAt: Date;

  public constructor(partial: Partial<StrategyItemResponse>) {
    Object.assign(this, partial);
  }
}
