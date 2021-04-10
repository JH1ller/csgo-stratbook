import ms from 'ms';

function getBooleanValue(value: string) {
  if (value.toLocaleLowerCase() === 'true') {
    return true;
  }
  return false;
}

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

  bull: {
    redis: {
      url: process.env.BULL_REDIS_URL,
    },
  },

  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT, 10),

    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,

    privateKey: process.env.MAIL_DKIM_PRIVATE_KEY,
  },

  persistence: {
    tmp: process.env.PERSISTENCE_TMP_DIR,
  },

  s3: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT,
    bucket: process.env.S3_BUCKET,
  },

  debug: {
    mailTransportDisabled: getBooleanValue(process.env.DEBUG_MAIL_TRANSPORT_DISABLED),
    createUserWithConfirmedMail: getBooleanValue(process.env.DEBUG_CREATE_USER_WITH_CONFIRMED_MAIL),
  },
});
