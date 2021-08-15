export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://stratbook.live/' : 'http://localhost:3554/';

export const API_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.stratbook.live/' : 'http://localhost:3554/api/';

export const APP_URL = process.env.NODE_ENV === 'production' ? 'https://app.stratbook.live/' : 'http://localhost:3554/';

export const STATIC_URL =
  process.env.NODE_ENV === 'production' ? 'https://static.stratbook.live/' : 'http://localhost:3554/static/';

export const S3_URL = 'https://csgo-stratbook.s3.amazonaws.com/';

export const SPLITBEE_ID = 'J3KX6SRRBPBD';

export const GA_ID = 'G-787NDTZVPN';
export const GTM_ID = 'GTM-TTHQVT5';
export const MXP_TOKEN = '626f6b394032519f813a44d8de173ee3';

export const HCAPTCHA_SITEKEY = '10bc0aba-a528-4e12-89fa-7fe15f29303d';
