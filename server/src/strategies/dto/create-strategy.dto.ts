import { IsBoolean, IsEnum, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { StrategyType, StrategyMap, StrategySide } from 'src/schemas/enums/strategy';

export class CreateStrategyDto {
  @IsString()
  @ApiProperty({ example: 'Test Strategy' })
  public readonly name: string;

  @IsEnum(StrategyType)
  @ApiProperty({ example: StrategyType.Pistol })
  public readonly type: StrategyType;

  @IsEnum(StrategyMap)
  @ApiProperty({ example: StrategyMap.Dust2 })
  public readonly map: StrategyMap;

  @IsEnum(StrategySide)
  @ApiProperty({ example: StrategySide.CounterTerrorists })
  public readonly side: StrategySide;

  @IsBoolean()
  @ApiProperty({ example: true })
  public readonly active: boolean;

  @IsUrl()
  @IsOptional()
  @ApiProperty({ example: 'https://www.youtube.com/' })
  public readonly videoLink: string;

  @IsString()
  @IsOptional()
  @MaxLength(512)
  @ApiProperty({ example: 'Hello World :)' })
  public readonly note: string;
}
