import { IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JoinTeamDto {
  @IsString()
  @MaxLength(6)
  @ApiProperty({ example: '550DDE' })
  public readonly code: string;
}
