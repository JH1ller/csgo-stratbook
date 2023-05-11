// TODO: refactor this whole file for different domains
const env = process.env.NODE_ENV as Environment;

const domain = window.location.hostname.split('.').slice(-2).join('.');

enum Environment {
  Development = 'development',
  Production = 'production',
}

const wsUrls: Record<Environment, string> = {
  development: `http://${domain}:3000/`,
  production: `https://${domain}/`,
};

export const WS_URL = wsUrls[env];
console.log(WS_URL);

const apiUrls: Record<Environment, string> = {
  development: `http://${domain}:3000/api/`,
  production: `https://api.${domain}/`,
};

export const API_URL = apiUrls[env];

const appUrls: Record<Environment, string> = {
  development: `http://${domain}:8080/`,
  production: window.location.origin,
};

export const APP_URL = appUrls[env];

export const S3_URL = 'https://csgo-stratbook.s3.amazonaws.com/';

export const TOKEN_TTL = 1 * 60 * 60 * 1000; // 1h

export const SPLITBEE_ID = 'J3KX6SRRBPBD';

// unused
export const GA_ID = 'G-787NDTZVPN';
export const GTM_ID = 'GTM-TTHQVT5';

export const MXP_TOKEN = '626f6b394032519f813a44d8de173ee3';

export const SENTRY_DSN = 'https://47606468801448cd909f02edde2defd7@o1161937.ingest.sentry.io/6248588';
