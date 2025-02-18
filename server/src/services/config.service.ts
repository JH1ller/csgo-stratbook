import dotenv from 'dotenv';

import { Path } from '@/constants';
import { Environment, parseEnvironment } from '@/utils/validation';
dotenv.config();

class ConfigService {
  private _env: Environment;

  readonly allowedOrigins = [
    'https://stratbook.pro',
    'https://stratbook.pro',
    'https://stratbook.app',
    'https://stratbook.app',
    'http://localhost.pro:3000',
    'http://localhost.pro:8080',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:8080',
    'https://jstin.dev',
  ];

  readonly appDir = './client-build/app/';
  readonly landingpageDir = './client-build/landingpage/';

  readonly s3Url = 'https://csgo-stratbook.s3.amazonaws.com/';

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
    return this.isDev ? 'localhost' : configService.env.ORIGIN;
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

  getUrl(path: Path) {
    const url = new URL(`${this.protocol}${this.origin}${this.isDev ? `:${this.port}` : ''}`);
    url.pathname = path;
    return url.href;
  }
}

const configService = new ConfigService();

export { configService };
