import { CookieOptions } from 'express';
import ms from 'ms';

import { configService } from '@/services/config.service';

export const refreshTokenConfig = (): CookieOptions => ({
  httpOnly: true,
  maxAge: ms(configService.env.REFRESH_TOKEN_TTL ?? '180d'),
  sameSite: 'lax',
  domain: '.' + configService.origin,
});

export const hasSessionConfig = (): CookieOptions => ({
  sameSite: 'lax',
  maxAge: ms(configService.env.REFRESH_TOKEN_TTL ?? '180d'),
  domain: '.' + configService.origin,
});
