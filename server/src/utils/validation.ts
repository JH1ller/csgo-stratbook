import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().required().email(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/)
    .required(),
});

export const profileUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(20),
  email: Joi.string().email(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/),
  completedTutorial: Joi.boolean(),
  color: Joi.string().min(4).max(7),
});

export const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/)
    .required(),
});

export const teamSchema = Joi.object({
  name: Joi.string().min(3).max(24).required(),
  website: Joi.string().min(6).uri().optional().allow(''),
  serverIp: Joi.string().min(6).max(200).optional().allow(''),
  serverPw: Joi.string().min(1).max(30).optional().allow(''),
});

export const dotEnvSchema = Joi.object({
  DATABASE_URL: Joi.string()
    .required()
    .pattern(/mongodb(\+srv)?:\/\/.*/),
  DATABASE_URL_DEV: Joi.string()
    .required()
    .pattern(/mongodb(\+srv)?:\/\/.*/),
  EMAIL_SECRET: Joi.string().required().min(32),
  TOKEN_SECRET: Joi.string().required().min(32),
  SOCKET_ADMIN_UI_PW: Joi.string().optional().min(6),
  MAIL_HOST: Joi.string().required().hostname(),
  MAIL_USER: Joi.string().required().email(),
  MAIL_PW: Joi.string().required().min(6),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  S3_BUCKET_NAME: Joi.string().required(),
  JWT_TOKEN_TTL: Joi.string().optional(),
  REFRESH_TOKEN_TTL: Joi.string().optional(),
  SENTRY_DSN: Joi.string().optional(),
  TELEGRAM_TOKEN: Joi.string().optional(),
  TELEGRAM_USER: Joi.string().optional(),
});
