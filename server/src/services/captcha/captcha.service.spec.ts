import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';

import { CaptchaService } from './captcha.service';

interface CaptchaConfig {
  hcaptcha: {
    secret: string;
  };

  debug?: {
    hcaptchaVerifyDisabled?: boolean;
  };
}

async function compileModule(config: () => CaptchaConfig) {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [config],
      }),
    ],
    providers: [CaptchaService],
  }).compile();

  return module;
}

describe('CaptchaService', () => {
  let service: CaptchaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [CaptchaService],
    }).compile();

    service = module.get(CaptchaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('verifyDisabledCheck', async () => {
    const module = await compileModule(() => ({
      hcaptcha: {
        secret: 'hello-world',
      },
      debug: {
        hcaptchaVerifyDisabled: true,
      },
    }));

    const service = module.get(CaptchaService);
    expect(await service.verify('empty-token')).toBe(true);
  });
});
