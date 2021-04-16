import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  public readonly email: string;
}
