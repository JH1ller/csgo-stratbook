import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { GameMap } from 'src/schemas/enums';

export class GetUtilityDto {
  @IsEnum(GameMap)
  @ApiProperty({ example: GameMap.Dust2, enum: GameMap })
  public readonly gameMap: GameMap;

  // helper for pagination
  // public readonly offset: number
}
