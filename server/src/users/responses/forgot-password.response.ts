import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

/**
 * debug model: Used for returning the generated jwt to the test client so
 * the password recovery can be tested without a running mail-server.
 */
export class ForgotPasswordResponse {
  @Expose()
  @ApiProperty({ required: false, description: 'debug result, only emitted when mail transport is disabled' })
  public readonly token?: string;

  constructor(token?: string) {
    this.token = token;
  }
}
