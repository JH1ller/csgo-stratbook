import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteUtilityDto {
  @IsMongoId()
  @ApiProperty({ description: 'Mongodb document Id' })
  public readonly documentId: string;

  @IsMongoId()
  @ApiProperty({ description: 'Utility array document id' })
  public readonly utilityId: string;
}
