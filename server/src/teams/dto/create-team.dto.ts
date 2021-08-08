import { IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @IsString()
  @Length(3, 24)
  @ApiProperty({ example: 'The Hello Worlds' })
  public readonly name: string;

  @IsUrl()
  @IsOptional()
  @Length(3, 256)
  @ApiProperty({ example: 'https://app.stratbook.live/' })
  public readonly website: string;

  @IsString()
  @IsOptional()
  @Length(6, 256)
  @ApiProperty({ example: '127.0.0.1', required: false })
  public readonly serverIp: string;

  @IsString()
  @IsOptional()
  @Length(1, 30)
  @ApiProperty({ example: 'hello', required: false })
  public readonly serverPassword: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  public readonly avatar: any;
}
