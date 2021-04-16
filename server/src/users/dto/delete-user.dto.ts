import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteUserDto {
  @IsString()
  @ApiProperty({ example: 'HelloWorld', description: 'Safety measure to prevent accidental deletion.' })
  public readonly userName: string;
}
