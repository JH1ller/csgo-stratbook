import { IsBooleanString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { GameMap, PlayerSide } from 'src/schemas/enums';
import { UtilityType, UtilityMouseButton, UtilityMovement } from 'src/schemas/enums/utility';

export class AddUtilityDto {
  @IsEnum(GameMap)
  @ApiProperty({ default: GameMap.Dust2, enum: GameMap, enumName: 'GameMap' })
  public readonly gameMap: GameMap;

  @IsString()
  @ApiProperty({ example: 'Smoke A-Long' })
  public readonly name: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiProperty({ example: 'The best smoke you have ever seen :)', required: false })
  public readonly description?: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  @ApiProperty({ example: 'https://www.youtube.com', required: false })
  public readonly videoLink?: string;

  @IsEnum(PlayerSide)
  @ApiProperty({ default: PlayerSide.CT, enum: PlayerSide, enumName: 'PlayerSide' })
  public readonly side: PlayerSide;

  @IsEnum(UtilityMouseButton)
  @ApiProperty({ default: UtilityMouseButton.LeftRight, enum: UtilityMouseButton, enumName: 'UtilityMouseButton' })
  public readonly mouseButton: UtilityMouseButton;

  @IsBooleanString()
  @ApiProperty({ default: false, example: true })
  public readonly crouch: boolean;

  @IsEnum(UtilityMovement)
  @ApiProperty({ default: UtilityMovement.Walk, enum: UtilityMovement, enumName: 'UtilityMovement' })
  public readonly movement: UtilityMovement;

  @IsBooleanString()
  @ApiProperty({ default: false, example: true })
  public readonly jump: boolean;

  @IsEnum(UtilityType)
  @ApiProperty({ default: UtilityType.Smoke, enum: UtilityType, enumName: 'UtilityType' })
  public readonly type: UtilityType;

  @IsOptional()
  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  public readonly images?: any[];
}
