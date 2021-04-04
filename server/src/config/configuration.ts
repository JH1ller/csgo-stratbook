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

  session: {
    secret: process.env.SESSION_SECRET,

    cookie: {
      ttl: ms(process.env.SESSION_COOKIE_TTL),
    },
  },

  persistence: {
    tmp: process.env.PERSISTENCE_TMP_DIR,
  },

  debug: {
    createUserWithConfirmedMail: process.env.DEBUG_CREATE_USER_WITH_CONFIRMED_MAIL,
  },
});
