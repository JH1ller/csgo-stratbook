import { IsString, Length } from 'class-validator';

export class DeleteTeamDto {
  @IsString()
  @Length(1, 32)
  public teamName: string;
}
