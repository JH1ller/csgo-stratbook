import { IsMongoId, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUtilityPositionDto {
  @IsMongoId()
  @ApiProperty({ description: 'Utility id' })
  public readonly id: string;

  @IsInt()
  @Min(0)
  @ApiProperty({ description: 'Old position where the utility was located' })
  public readonly oldPosition: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ description: 'New position where the utility should be placed at' })
  public readonly newPosition: number;
}
