import { IsEmail, IsString, Matches, MaxLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { passwordPattern } from 'src/common/validation-helpers';

/**
 * swagger definitions dto
 */
export class LocalSignInDto {
  @IsEmail()
  @MaxLength(128)
  @ApiProperty({ example: 'test@stratbook.live' })
  public readonly email: string;

  @IsString()
  @Length(6, 128)
  @Matches(passwordPattern, {
    message: 'password too weak',
  })
  @ApiProperty({ example: 'HelloWorld12345!' })
  public readonly password: string;
}
