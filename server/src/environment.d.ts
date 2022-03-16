declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL_DEV: string;
      DATABASE_URL: string;
      NODE_ENV: 'development' | 'production';
      PORT: string;
      EMAIL_SECRET: string;
      S3_BUCKET_NAME: string;
      TOKEN_SECRET: string;
      SENTRY_DSN: string;
    }
  }
}
