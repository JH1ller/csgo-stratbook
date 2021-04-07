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

  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,

    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },

  persistence: {
    tmp: process.env.PERSISTENCE_TMP_DIR,
  },

  debug: {
    mailTransportDisabled: process.env.DEBUG_MAIL_TRANSPORT_DISABLED,
    createUserWithConfirmedMail: process.env.DEBUG_CREATE_USER_WITH_CONFIRMED_MAIL,
  },
});
