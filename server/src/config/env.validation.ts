import { plainToClass } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsNumber, validateSync } from 'class-validator';

/**
 * @summary helper class for validating .env-file properties
 */
class EnvironmentVariables {
  @IsNumber()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsBoolean()
  @IsOptional()
  USE_CAPTCHA: boolean;

  @IsString()
  @IsOptional()
  RECAPTCHA_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
