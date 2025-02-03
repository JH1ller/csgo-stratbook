import dotenv from 'dotenv';

import { Path } from '@/constants';
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

  getUrl(path: Path) {
    const url = new URL(`${this.protocol}${this.origin}${this.isDev ? `:${this.port}` : ''}`);
    url.pathname = path;
    return url.href;
  }
}

const configService = new ConfigService();

export { configService };
