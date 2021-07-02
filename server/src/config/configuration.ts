import ms from 'ms';

import { resolvePrepareDirectory } from './helpers/temp-directory';

function getBooleanValue(value: string | undefined) {
  if (value && value.toLocaleLowerCase() === 'true') {
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
  baseUrl: process.env.BASE_URL,

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
    port: Number.parseInt(process.env.MAIL_PORT, 10),

    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,

    privateKey: process.env.MAIL_DKIM_PRIVATE_KEY,
    tokenSecret: process.env.MAIL_TOKEN_SECRET,
  },

  upload: {
    tempDir: resolvePrepareDirectory(process.env.UPLOAD_TEMP_DIR),
  },

  minio: {
    accessKeyId: process.env.MINIO_ACCESS_KEY_ID,
    secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY,
    endpoint: process.env.MINIO_ENDPOINT,
    port: Number.parseInt(process.env.MINIO_PORT, 10),
    useSSL: getBooleanValue(process.env.MINIO_USE_SSL),

    imageBucket: process.env.MINIO_IMAGE_BUCKET,
  },

  hcaptcha: {
    secret: process.env.HCAPTCHA_SECRET,
  },

  debug: {
    mailTransportDisabled: getBooleanValue(process.env.DEBUG_MAIL_TRANSPORT_DISABLED),
    hcaptchaVerifyDisabled: getBooleanValue(process.env.DEBUG_HCAPTCHA_VERIFY_DISABLED),

    createUserWithConfirmedMail: getBooleanValue(process.env.DEBUG_CREATE_USER_WITH_CONFIRMED_MAIL),
  },
});
