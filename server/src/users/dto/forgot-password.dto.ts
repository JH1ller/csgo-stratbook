import { IsEmail, MaxLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @IsEmail()
  @MaxLength(128)
  @ApiProperty({ description: 'user mail', example: 'hello-world@stratbook.live' })
  public readonly email: string;

  @IsString()
  @ApiProperty({ description: 'hcaptcha response code', example: '1111111122222223333333444' })
  public readonly captchaResponse: string;
}
