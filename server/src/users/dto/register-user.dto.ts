import { IsString, MinLength, MaxLength, IsEmail, Matches } from 'class-validator';
import { passwordPattern } from 'src/common/validation-helpers';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  public readonly userName: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(128)
  public readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @Matches(passwordPattern)
  public readonly password: string;
}
