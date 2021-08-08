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
  @ApiProperty({ example: 'The best smoke on A' })
  public readonly name?: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @ApiProperty({ example: 'Some text is here!' })
  public readonly note?: string;

  @IsEnum(PlayerSide)
  @IsOptional()
  @ApiProperty({ example: PlayerSide.Terrorists, enum: PlayerSide })
  public readonly side?: PlayerSide;

  @IsEnum(StrategyType)
  @IsOptional()
  @ApiProperty({ example: StrategyType.BuyRound, enum: StrategyType })
  public readonly type?: StrategyType;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  public readonly active?: boolean;

  @IsUrl()
  @MaxLength(256)
  @IsOptional()
  @ApiProperty({ example: 'https://www.youtube.com/' })
  public readonly videoLink?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'this shall be a very long text, hello world :)!' })
  public readonly content?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  public readonly shared?: boolean;
}
