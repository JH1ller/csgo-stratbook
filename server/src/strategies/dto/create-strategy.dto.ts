import { IsBoolean, IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { GameMap, PlayerSide } from 'src/schemas/enums';
import { StrategyType } from 'src/schemas/enums/strategy';

export class CreateStrategyDto {
  @IsEnum(GameMap)
  @ApiProperty({ example: GameMap.Dust2, enum: GameMap })
  public readonly gameMap: GameMap;

  @IsString()
  @ApiProperty({ example: 'Test Strategy', type: String })
  public readonly name: string;

  @IsEnum(StrategyType)
  @ApiProperty({ example: StrategyType.Pistol, enum: StrategyType, required: false })
  public readonly type: StrategyType;

  @IsEnum(PlayerSide)
  @ApiProperty({ example: PlayerSide.CounterTerrorists, enum: PlayerSide })
  public readonly side: PlayerSide;

  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({ example: true, type: Boolean })
  public readonly active: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  @ApiProperty({ example: 'Hello World :)', type: String, required: false })
  public readonly note: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(250)
  @ApiProperty({ example: 'https://www.youtube.com/', type: String, required: false })
  public readonly videoLink: string;
}
