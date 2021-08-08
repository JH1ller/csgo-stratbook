import { IsString, MinLength, MaxLength, IsEmail, Matches, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PasswordPattern } from 'src/common/validation-helpers';

export class ProfileUpdateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  @IsOptional()
  @ApiProperty({ example: 'HelloWorld', required: false })
  public readonly userName?: string;

  @IsEmail()
  @MaxLength(128)
  @IsOptional()
  @ApiProperty({ example: 'hello-world@stratbook.live', required: false })
  public readonly email?: string;

  @IsString()
  @MinLength(6)
  @Matches(PasswordPattern, {
    message: 'password too weak',
  })
  @IsOptional()
  @ApiProperty({ example: 'HelloWorld1', required: false })
  public readonly password?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false, required: false })
  public readonly completedTutorial?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: true,
    description: 'true if user name should be replaced in strategies',
    required: false,
  })
  public readonly updateStrategies?: boolean;
}
