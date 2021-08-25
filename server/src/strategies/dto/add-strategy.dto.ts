import { IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { GameMap, PlayerSide } from 'src/schemas/enums';
import { StrategyType } from 'src/schemas/enums/strategy';

export class AddStrategyDto {
  @IsEnum(GameMap)
  @ApiProperty({ example: GameMap.Dust2, enum: GameMap, enumName: 'GameMap' })
  public readonly gameMap: GameMap;

  @IsString()
  @ApiProperty({ example: 'Test Strategy' })
  public readonly name: string;

  @IsEnum(StrategyType)
  @ApiProperty({ example: StrategyType.Pistol, enum: StrategyType, enumName: 'StrategyType' })
  public readonly type: StrategyType;

  @IsEnum(PlayerSide)
  @ApiProperty({ example: PlayerSide.CT, enum: PlayerSide, enumName: 'PlayerSide' })
  public readonly side: PlayerSide;

  @IsString()
  @IsOptional()
  @MaxLength(250)
  @ApiProperty({ example: 'Hello World :)', required: false })
  public readonly note?: string;

  @IsUrl()
  @IsOptional()
  @MaxLength(250)
  @ApiProperty({ example: 'https://www.youtube.com/', required: false })
  public readonly videoLink?: string;
}
