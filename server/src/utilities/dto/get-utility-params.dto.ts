import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { GameMap } from 'src/schemas/enums';

export class GetUtilityParamsDto {
  @IsEnum(GameMap)
  @ApiProperty({ example: GameMap.Dust2, enum: GameMap, enumName: 'GameMap' })
  public readonly gameMap: GameMap;

  // helper for pagination
  // public readonly offset: number
}
