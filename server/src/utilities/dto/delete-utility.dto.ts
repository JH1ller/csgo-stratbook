import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUtilityDto {
  @IsMongoId()
  @ApiProperty({ description: 'utility sub-document Id' })
  public readonly id: string;
}
