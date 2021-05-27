export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://stratbook.live/' : 'http://localhost:3000/';

export const API_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.stratbook.live/' : 'http://localhost:3000/api/';

export const APP_URL = process.env.NODE_ENV === 'production' ? 'https://app.stratbook.live/' : 'http://localhost:3000/';

export const STATIC_URL =
  process.env.NODE_ENV === 'production' ? 'https://static.stratbook.live/' : 'http://localhost:3000/static/';

export const S3_URL = 'https://csgo-stratbook.s3.amazonaws.com/';

export const TOKEN_TTL = 1 * 60 * 60 * 1000; // 1h

export const SPLITBEE_ID = 'J3KX6SRRBPBD';

export const GA_ID = 'G-787NDTZVPN';
