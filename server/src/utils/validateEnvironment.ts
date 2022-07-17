import Joi from 'joi';
import { Log } from './logger';

const schema = Joi.object({
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  DATABASE_URL: Joi.string()
    .required()
    .regex(/^mongodb\+srv:\/\/.+/),
  DATABASE_URL_DEV: Joi.string()
    .required()
    .regex(/^mongodb\+srv:\/\/.+/),
  EMAIL_SECRET: Joi.string().required(),
  JWT_TOKEN_TTL: Joi.string().required(),
  MAIL_HOST: Joi.string().required(),
  MAIL_PW: Joi.string().required(),
  MAIL_USER: Joi.string().required().email(),
  REFRESH_TOKEN_TTL: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  SENTRY_DSN: Joi.string().required().uri(),
  SOCKET_ADMIN_UI_PW: Joi.string().required(),
  TOKEN_SECRET: Joi.string().required(),
  STEAM_API_KEY: Joi.string().required(),
}).unknown(true);

export const validateEnvironment = () => {
  const { error } = schema.validate(process.env);
  if (error) {
    Log.error('validateEnvironment', error.message);
    return false;
  }

  return true;
};
