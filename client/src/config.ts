import { isDesktop } from './utils/isDesktop';

enum Environment {
  Development = 'development',
  Production = 'production',
}

// TODO: refactor this whole file for different domains
const env = process.env.NODE_ENV as Environment;

function getOrigin(subdomain: string) {
  const url = new URL(window.location.href);
  url.hostname = url.hostname.replace('app.', subdomain ? subdomain + '.' : '');
  if (env === Environment.Development) {
    url.port = '3000';
  }
  return url.origin;
}

// TODO: find generic solution for Electron
// const host = isDesktop() ? 'stratbook.pro' : window.location.host.match(hostRx)?.groups?.host;

// const hostRx = /^https?:\/\/(?<subdomain>\w+)\.(?:\w+\.\w+|\w+:\d+)/;
// const host = window.location.origin;

export const WS_URL = getOrigin('');

export const API_URL = getOrigin('api');

export const APP_URL = window.location.origin;

export const S3_URL = 'https://csgo-stratbook.s3.amazonaws.com/';

export const TOKEN_TTL = 1 * 60 * 60 * 1000; // 1h

export const SPLITBEE_ID = 'J3KX6SRRBPBD';

export const MXP_TOKEN = '626f6b394032519f813a44d8de173ee3';

export const SENTRY_DSN = 'https://47606468801448cd909f02edde2defd7@o1161937.ingest.sentry.io/6248588';
