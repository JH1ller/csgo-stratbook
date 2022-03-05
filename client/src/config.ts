const isProd = () => process.env.NODE_ENV === 'production';

export const WS_URL = isProd() ? 'https://stratbook.live/' : `http://${window.location.hostname}:3000/`;

export const API_URL = isProd() ? 'https://api.stratbook.live/' : `http://${window.location.hostname}:3000/api/`;

export const S3_URL = 'https://csgo-stratbook.s3.amazonaws.com/';

export const TOKEN_TTL = 1 * 60 * 60 * 1000; // 1h

export const SPLITBEE_ID = 'J3KX6SRRBPBD';

// unused
export const GA_ID = 'G-787NDTZVPN';
export const GTM_ID = 'GTM-TTHQVT5';

export const MXP_TOKEN = '626f6b394032519f813a44d8de173ee3';
