import { IsString, MinLength, MaxLength, IsEmail, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { passwordPattern } from 'src/common/validation-helpers';

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({ example: 'HelloWorld' })
  public readonly userName: string;

  @IsEmail()
  @MaxLength(128)
  @ApiProperty({ example: 'hello-world@stratbook.live' })
  public readonly email: string;

  @IsString()
  @MinLength(6)
  @Matches(passwordPattern, {
    message: 'password too weak',
  })
  @ApiProperty({ example: 'HelloWorld1' })
  public readonly password: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  public readonly avatar: any;
}
