import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUtilityDto {
  @IsMongoId()
  @ApiProperty()
  public readonly id: string;
}
