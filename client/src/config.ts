export const BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://stratbook.live/' : 'http://localhost.stratbook:3000/';

export const API_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.stratbook.live/' : 'http://api.localhost.stratbook:3000/';

export const APP_URL =
  process.env.NODE_ENV === 'production' ? 'https://app.stratbook.live/' : 'http://app.localhost.stratbook:3000/';

export const STATIC_URL =
  process.env.NODE_ENV === 'production' ? 'https://static.stratbook.live/' : 'http://static.localhost.stratbook:3000/';

export const S3_URL = 'https://csgo-stratbook.s3.amazonaws.com/';
