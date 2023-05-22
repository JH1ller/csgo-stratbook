const isProd = () => process.env.NODE_ENV === 'production';

export const BASE_URL = isProd() ? 'https://stratbook.pro/' : 'http://localhost:3000/';

export const API_URL = isProd() ? 'https://api.stratbook.pro/' : 'http://localhost:3000/api/';

export const APP_URL = isProd() ? 'https://app.stratbook.pro/' : 'http://localhost:3000/';

export const STATIC_URL = isProd() ? 'https://static.stratbook.pro/' : 'http://localhost:3000/static/';

export const S3_URL = 'https://csgo-stratbook.s3.amazonaws.com/';
