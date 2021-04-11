import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { GameMap, PlayerSide } from 'src/schemas/enums';
import { UtilityType, UtilityMouseButton, UtilityMovement } from 'src/schemas/enums/utility';

export class AddUtilityDto {
  @IsString()
  @ApiProperty({ default: 'Smoke A-Long' })
  public readonly name: string;

  @IsString()
  @MaxLength(200)
  @IsOptional()
  @ApiProperty({ default: 'The best smoke you have ever seen :)' })
  public readonly description: string;

  @IsString()
  @MaxLength(300)
  @IsOptional()
  @ApiProperty({ default: 'https://www.youtube.com' })
  public readonly videoLink: string;

  @IsEnum(UtilityType)
  @ApiProperty({ default: UtilityType.Smoke })
  public readonly type: UtilityType;

  @IsEnum(GameMap)
  @ApiProperty({ default: GameMap.Dust2 })
  public readonly map: GameMap;

  @IsEnum(PlayerSide)
  @ApiProperty({ default: PlayerSide.CounterTerrorists })
  public readonly side: PlayerSide;

  @IsEnum(UtilityMouseButton)
  @ApiProperty({ default: UtilityMouseButton.LeftRight })
  public readonly mouseButton: UtilityMouseButton;

  @IsBoolean()
  @ApiProperty({ default: true })
  public readonly crouch: boolean;

  @IsBoolean()
  @ApiProperty({ default: false })
  public readonly jump: boolean;

  @IsEnum(UtilityMovement)
  @ApiProperty({ default: UtilityMovement.Walk })
  public readonly movement: UtilityMovement;
}
