import { IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PasswordPattern } from 'src/common/validation-helpers';

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  @Matches(PasswordPattern, {
    message: 'password too weak',
  })
  @ApiProperty({ example: 'HelloWorld12345!' })
  public readonly password: string;

  @IsString()
  @ApiProperty()
  public readonly token: string;

  @IsString()
  @ApiProperty()
  public readonly captchaResponse: string;
}
