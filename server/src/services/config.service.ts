import dotenv from 'dotenv';

import { Environment, parseEnvironment } from '@/utils/validation';
dotenv.config();

class ConfigService {
  private _env: Environment;

  readonly allowedOrigins = [
    'https://stratbook.pro',
    'app://.',
    'https://stratbook.pro',
    'http://localhost.pro:8080',
    'http://localhost.pro:3000',
    'http://localhost:8080',
    'http://localhost:3000',
    'https://jstin.dev',
    'https://jstin.dev',
  ];

  readonly appDir = './client-build/app/';
  readonly landingpageDir = './client-build/landingpage/';

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
    return this.isDev ? 'localhost.pro' : 'jstin.dev'; // TODO: 'stratbook.pro';
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
      apiUrl: Object.freeze(new URL(`${this.protocol}${this.origin}${this.isDev ? `:${this.port}` : ''}/api/`)),
      appUrl: Object.freeze(new URL(`${this.protocol}app.${this.origin}${this.isDev ? `:${this.port}` : ''}/`)),
      staticUrl: Object.freeze(new URL(`${this.protocol}${this.origin}${this.isDev ? `:${this.port}` : ''}/static/`)),
      s3Url: Object.freeze(new URL('https://csgo-stratbook.s3.amazonaws.com/')),
    };
  }
}

const configService = new ConfigService();

export { configService };
