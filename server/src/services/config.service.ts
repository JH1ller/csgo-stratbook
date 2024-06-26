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
    'http://app.localhost:8080',
    'http://app.localhost:3000',
  ];

  constructor() {
    this._env = parseEnvironment();
  }

  get env() {
    return this._env;
  }

  get port(): number {
    return Number(configService.env.PORT) || 3000;
  }

  get origin() {
    return this.isDev ? 'localhost.pro' : 'stratbook.pro';
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
      baseUrl: Object.freeze(new URL(`${this.protocol}${this.origin}${this.isDev ? `:${this.port}` : ''}/`)),
      apiUrl: Object.freeze(new URL(`${this.protocol}api.${this.origin}${this.isDev ? `:${this.port}` : ''}/`)),
      appUrl: Object.freeze(new URL(`${this.protocol}app.${this.origin}${this.isDev ? `:${this.port}` : ''}/`)),
      staticUrl: Object.freeze(new URL(`${this.protocol}static.${this.origin}${this.isDev ? `:${this.port}` : ''}/`)),
      s3Url: Object.freeze(new URL('https://csgo-stratbook.s3.amazonaws.com/')),
    };
  }
}

const configService = new ConfigService();

export { configService };
