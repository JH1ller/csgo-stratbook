import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteStrategyDto {
  @IsMongoId()
  @ApiProperty({ description: 'Strategy id' })
  public readonly id: string;
}
