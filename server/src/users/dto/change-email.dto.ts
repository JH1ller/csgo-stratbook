import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeEmailDto {
  @IsEmail()
  @ApiProperty({ example: 'hello-world@stratbook.live' })
  public readonly email: string;
}
