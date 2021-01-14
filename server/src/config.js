module.exports.BASE_URL = process.env.NODE_ENV === 'production' ? 'https://stratbook.live/' : 'http://localhost:3000/';

module.exports.API_URL =
  process.env.NODE_ENV === 'production' ? 'https://api.stratbook.live/' : 'http://localhost:3000/api/';

module.exports.APP_URL =
  process.env.NODE_ENV === 'production' ? 'https://app.stratbook.live/' : 'http://localhost:3000/';

module.exports.STATIC_URL =
  process.env.NODE_ENV === 'production' ? 'https://static.stratbook.live/' : 'http://localhost:3000/static/';

module.exports.S3_URL = 'https://csgo-stratbook.s3.amazonaws.com/';
