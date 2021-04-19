import { plainToClass } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsNumber, validateSync, MinLength, IsUrl } from 'class-validator';

/**
 * @summary helper class for validating .env-file properties
 */
class EnvironmentVariables {
  /**
   * Port on which the server listens to
   */
  @IsNumber()
  PORT: number;

  @IsString()
  BASE_URL: string;

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

  /**
   * Redis connection url for bull-based queues
   */
  @IsString()
  BULL_REDIS_URL: string;

  /**
   * Mail host
   */
  @IsString()
  MAIL_HOST: string;

  /**
   * Mail port
   */
  @IsNumber()
  MAIL_PORT: number;

  @IsString()
  MAIL_USER: string;

  @IsString()
  MAIL_PASSWORD: string;

  /**
   * OpenSSL generated private key. Can be generated with ``node ./gen-dkim-private-key.js``
   */
  @IsString()
  MAIL_DKIM_PRIVATE_KEY: string;

  @IsString()
  @MinLength(32)
  MAIL_TOKEN_SECRET: string;

  /**
   * Temporary directory for storing uploads. Directory is deleted on each startup.
   */
  @IsString()
  UPLOAD_TEMP_DIR: string;

  @IsString()
  S3_ACCESS_KEY_ID: string;

  @IsString()
  S3_SECRET_ACCESS_KEY: string;

  @IsUrl()
  S3_ENDPOINT: string;

  @IsString()
  S3_IMAGE_BUCKET: string;

  @IsString()
  HCAPTCHA_SECRET: string;

  /**
   * Disables mail transport
   */
  @IsBoolean()
  @IsOptional()
  DEBUG_MAIL_TRANSPORT_DISABLED: boolean;

  /**
   * disables hcaptcha verify check (check always returns true)
   */
  @IsBoolean()
  @IsOptional()
  DEBUG_HCAPTCHA_VERIFY_DISABLED: boolean;

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
