import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { GameMap } from 'src/schemas/enums';

export class GetStrategiesDto {
  @IsEnum(GameMap)
  @ApiProperty({ example: GameMap.Dust2, enum: GameMap })
  public readonly gameMap: GameMap;
}
