import { IsString, MinLength, MaxLength, IsEmail, Matches } from 'class-validator';
import { passwordPattern } from 'src/common/validation-helpers';

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  public readonly userName: string;

  @IsEmail()
  @MaxLength(128)
  public readonly email: string;

  @IsString()
  @MinLength(6)
  @Matches(passwordPattern)
  public readonly password: string;
}
