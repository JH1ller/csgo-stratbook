import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(20),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(20),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/),
  completedTutorial: z.boolean(),
  color: z.string().min(4).max(7),
});

export const loginSchema = z.object({
  email: z.string().min(6).email(),
  password: z
    .string()
    .min(6)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/),
});

export const teamSchema = z.object({
  name: z.string().min(3).max(24),
  website: z.string().min(6).url().optional().or(z.literal('')),
  serverIp: z.string().min(6).max(200).optional().or(z.literal('')),
  serverPw: z.string().min(1).max(30).optional().or(z.literal('')),
});

export const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production']),
  DATABASE_URL: z.string().regex(/mongodb(\+srv)?:\/\/.*/),
  DATABASE_URL_DEV: z
    .string()
    .regex(/mongodb(\+srv)?:\/\/.*/)
    .optional(),
  EMAIL_SECRET: z.string().min(32),
  TOKEN_SECRET: z.string().min(32),
  SOCKET_ADMIN_UI_PW: z.string().min(6).optional(),
  MAIL_HOST: z.string(),
  MAIL_USER: z.string().email(),
  MAIL_PW: z.string().min(6),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
  JWT_TOKEN_TTL: z.string().optional(),
  REFRESH_TOKEN_TTL: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  TELEGRAM_TOKEN: z.string().optional(),
  TELEGRAM_USER: z.string().optional(),
  STEAM_API_KEY: z.string(),
  PRISMIC_TOKEN: z.string(),
});

export const parseEnvironment = () => {
  const { error, data } = envSchema.safeParse(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.format()._errors.join(', ')}`);
  }

  return data;
};

export type Environment = z.infer<typeof envSchema>;
