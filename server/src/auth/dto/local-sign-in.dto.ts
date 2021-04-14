import { ApiProperty } from '@nestjs/swagger';

/**
 * swagger definitions dto
 */
export class LocalSignInDto {
  @ApiProperty({ example: 'test@stratbook.live', type: String })
  public readonly email: string;

  @ApiProperty({ example: 'HelloWorld12345!', type: String })
  public readonly password: string;
}
