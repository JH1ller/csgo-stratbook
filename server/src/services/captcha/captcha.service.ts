import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import hcaptcha from 'hcaptcha';
import { isDevEnv } from 'src/common/env';

@Injectable()
export class CaptchaService {
  private readonly logger = new Logger(CaptchaService.name);

  private readonly verifyDisabled: boolean;

  constructor(private readonly configService: ConfigService) {
    this.verifyDisabled = this.configService.get<boolean>('debug.hcaptchaVerifyDisabled');
    if (this.verifyDisabled) {
      this.logger.warn('hcaptcha verify check disabled.');
    }
  }

  public async verify(token: string): Promise<boolean> {
    if (this.verifyDisabled) {
      this.logger.warn(`skipped hcaptcha verification for token: ${token}`);
      return Promise.resolve(true);
    }

    const secret = this.configService.get<string>('hcaptcha.secret');
    const result = await hcaptcha.verify(secret, token);
    if (!result.success) {
      if (isDevEnv() && result['error-codes']) {
        for (const i of result['error-codes']) {
          this.logger.error(`hcaptcha validation error ${i}`);
        }
      }

      return false;
    }

    return true;
  }
}
