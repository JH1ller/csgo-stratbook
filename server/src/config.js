module.exports.BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://stratbook.live/' : 'http://localhost.stratbook:3000/';

module.exports.API_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.stratbook.live/' : 'http://api.localhost.stratbook:3000/';

module.exports.APP_URL =
  process.env.NODE_ENV === 'production' ? 'https://app.stratbook.live/' : 'http://app.localhost.stratbook:3000/';

module.exports.STATIC_URL =
  process.env.NODE_ENV === 'production' ? 'https://static.stratbook.live/' : 'http://static.localhost.stratbook:3000/';

module.exports.S3_URL = 'https://csgo-stratbook.s3.amazonaws.com/';
