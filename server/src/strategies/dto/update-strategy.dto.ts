import { IsBoolean, IsEnum, IsMongoId, IsUrl, IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PlayerSide } from 'src/schemas/enums';
import { StrategyType } from 'src/schemas/enums/strategy';

export class UpdateStrategyDto {
  @IsMongoId()
  @ApiProperty({ description: 'strategy sub-document id' })
  public readonly id: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  @ApiProperty()
  public readonly name?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiProperty()
  public readonly note?: string;

  @IsEnum(PlayerSide)
  @IsOptional()
  @ApiProperty({ enum: PlayerSide })
  public readonly side?: PlayerSide;

  @IsEnum(StrategyType)
  @IsOptional()
  @ApiProperty({ enum: StrategyType })
  public readonly type?: StrategyType;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public readonly active?: boolean;

  @IsUrl()
  @MaxLength(256)
  @IsOptional()
  @ApiProperty()
  public readonly videoLink?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  public readonly content?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  public readonly shared?: boolean;
}
