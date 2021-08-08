import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteTeamDto {
  @IsString()
  @Length(1, 32)
  @ApiProperty({ example: 'The Hello Worlds' })
  public teamName: string;
}
