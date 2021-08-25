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
  @ApiProperty({ example: 'The best smoke on A', required: false })
  public readonly name?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiProperty({ example: 'Some text is here!', required: false })
  public readonly note?: string;

  @IsEnum(PlayerSide)
  @IsOptional()
  @ApiProperty({ example: PlayerSide.T, enum: PlayerSide, enumName: 'PlayerSide', required: false })
  public readonly side?: PlayerSide;

  @IsEnum(StrategyType)
  @IsOptional()
  @ApiProperty({ example: StrategyType.BuyRound, enum: StrategyType, enumName: 'StrategyType', required: false })
  public readonly type?: StrategyType;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false, required: false })
  public readonly active?: boolean;

  @IsUrl()
  @MaxLength(256)
  @IsOptional()
  @ApiProperty({ example: 'https://www.youtube.com/', required: false })
  public readonly videoLink?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'this shall be a very long text, hello world :)!', required: false })
  public readonly content?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true, required: false })
  public readonly shared?: boolean;
}
