const env = process.env.NODE_ENV as Environment;

enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

const hostNames: Record<Environment, string> = {
  development: 'localhost',
  staging: 'csstrats-app.herokuapp.com',
  production: 'stratbook.live',
};

export const HOST_NAME = hostNames[env];

const wsUrls: Record<Environment, string> = {
  development: `http://${window.location.hostname}:3000/`,
  staging: 'https://csstrats-app.herokuapp.com/',
  production: 'https://stratbook.live/',
};

export const WS_URL = wsUrls[env];

const apiUrls: Record<Environment, string> = {
  development: `http://${window.location.hostname}:3000/api/`,
  staging: 'https://csstrats-app.herokuapp.com/api/',
  production: 'https://api.stratbook.live/',
};

export const API_URL = apiUrls[env];

const appUrls: Record<Environment, string> = {
  development: `http://${window.location.hostname}:8080/`,
  staging: 'https://csstrats-app.herokuapp.com/app/',
  production: 'https://app.stratbook.live/',
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
