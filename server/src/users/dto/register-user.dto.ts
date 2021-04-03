import { IsString, MinLength, MaxLength, IsEmail, Matches } from 'class-validator';
import { passwordPattern } from 'src/common/validation-helpers';
import { ApiProperty } from '@nestjs/swagger';

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
}
