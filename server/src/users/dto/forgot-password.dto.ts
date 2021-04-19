import { IsEmail, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @IsEmail()
  @MaxLength(128)
  @ApiProperty({ example: 'hello-world@stratbook.live' })
  public readonly email: string;
}
