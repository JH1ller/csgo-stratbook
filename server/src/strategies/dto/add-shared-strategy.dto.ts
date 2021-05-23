import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddSharedStrategyDto {
  @IsMongoId()
  @ApiProperty({ description: 'Strategy id' })
  public readonly id: string;
}
