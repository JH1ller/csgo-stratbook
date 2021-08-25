import { IsString, MinLength, MaxLength, IsEmail, Matches, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PasswordPattern } from 'src/common/validation-helpers';
import { UserMailNotInUseRule } from 'src/common/validators/user-mail-not-in-use.validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @ApiProperty({ example: 'HelloWorld' })
  public readonly userName: string;

  @IsEmail()
  @MaxLength(128)
  @Validate(UserMailNotInUseRule)
  @ApiProperty({ example: 'test@stratbook.live' })
  public readonly email: string;

  @IsString()
  @MinLength(6)
  @Matches(PasswordPattern, {
    message: 'password too weak',
  })
  @ApiProperty({ example: 'HelloWorld12345!' })
  public readonly password: string;
}
