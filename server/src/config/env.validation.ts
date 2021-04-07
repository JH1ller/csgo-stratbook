import { plainToClass } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsNumber, validateSync, MinLength, Validate } from 'class-validator';

import { DirectoryExistsConstraint } from './constraints/directory-exists-constraint';

/**
 * @summary helper class for validating .env-file properties
 */
class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  /**
   * Mongodb connection string
   */
  @IsString()
  DATABASE_URL: string;

  /**
   * express-session cookie secret
   */
  @IsString()
  @MinLength(32)
  SESSION_SECRET: string;

  /**
   * express-session cookie maxAge. Specified as ms-module string.
   */
  @IsString()
  SESSION_COOKIE_TTL: string;

  @IsString()
  MAIL_HOST: string;

  @IsNumber()
  MAIL_PORT: number;

  @IsString()
  MAIL_USER: string;

  @IsString()
  MAIL_PASSWORD: string;

  @IsString()
  // @Validate(DirectoryExistsConstraint, { message: 'temp directory does not exist.' })
  PERSISTENCE_TMP_DIR: string;

  @IsBoolean()
  @IsOptional()
  USE_CAPTCHA: boolean;

  @IsString()
  @IsOptional()
  RECAPTCHA_SECRET: string;

  /**
   * Disables mail transport
   */
  @IsBoolean()
  @IsOptional()
  DEBUG_MAIL_TRANSPORT_DISABLED: boolean;

  @IsBoolean()
  @IsOptional()
  DEBUG_CREATE_USER_WITH_CONFIRMED_MAIL: boolean;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
