import ms = require('ms');

/**
 * @summary Prepares a new configuration object which is injected into nestjs's configuration service.
 * @example configService.get<string>('database.url');
 */
export default () => ({
  port: parseInt(process.env.PORT, 10),

  database: {
    url: process.env.DATABASE_URL,
  },

  cookie: {
    secret: process.env.COOKIE_SECRET,
  },

  session: {
    key: Buffer.from(process.env.SESSION_KEY, 'hex'),

    cookie: {
      ttl: ms(process.env.SESSION_COOKIE_TTL),
    },
  },
});
