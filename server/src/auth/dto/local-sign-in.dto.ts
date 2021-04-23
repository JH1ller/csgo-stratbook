import { ApiProperty } from '@nestjs/swagger';

/**
 * swagger definitions dto
 */
export class LocalSignInDto {
  @ApiProperty({ example: 'test@stratbook.live' })
  public readonly email: string;

  @ApiProperty({ example: 'HelloWorld12345!' })
  public readonly password: string;
}
