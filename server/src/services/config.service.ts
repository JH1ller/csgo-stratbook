import dotenv from 'dotenv';

import { Environment, parseEnvironment } from '@/utils/validation';
dotenv.config();

class ConfigService {
  private _env: Environment;

  readonly allowedOrigins = [
    'https://stratbook.pro',
    'app://.',
    'https://app.stratbook.pro',
    'http://app.localhost.pro:8080',
    'http://app.localhost.pro:3000',
  ];

  constructor() {
    this._env = parseEnvironment();
  }

  get env() {
    return this._env;
  }

  get origin() {
    return this.isDev ? 'localhost.pro:3000' : 'stratbook.pro';
  }

  get protocol() {
    return this.isDev ? 'http://' : 'https://';
  }

  get isDev() {
    return this.env.NODE_ENV === 'development';
  }

  get isProd() {
    return !this.isDev;
  }

  get urls() {
    return {
      baseUrl: `${this.protocol}${this.origin}/`,
      apiUrl: `${this.protocol}api.${this.origin}/`,
      appUrl: `${this.protocol}app.${this.origin}/`,
      staticUrl: `${this.protocol}static.${this.origin}/`,
      s3Url: 'https://csgo-stratbook.s3.amazonaws.com/',
    };
  }
}

const configService = new ConfigService();

export { configService };
