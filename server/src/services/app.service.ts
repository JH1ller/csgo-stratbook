import { createServer, Server } from 'node:http';

import * as Sentry from '@sentry/node';
import { green } from 'colors';
import compression from 'compression';
import history from 'connect-history-api-fallback';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import rateLimit from 'express-rate-limit';
import subdomain from 'express-subdomain';
import helmet from 'helmet';
import mongoose from 'mongoose';

import { loggerMiddleware } from '../middleware/logger';
import { hostRedirect, secureRedirect } from '../middleware/redirect';
import apiRouter from '../routes/api';
import { Logger } from '../utils/logger';
import { configService } from './config.service';

const logger = new Logger('AppService');

class AppService {
  private app: Application;
  private _httpServer: Server;
  port: number;
  private db = mongoose.connection;

  constructor() {
    this.app = express();
    this.port = Number(configService.env.PORT) || 3000;
    this._httpServer = createServer(this.app);
    this.setupDbConnection();
    this.setupMiddleware();
    this.setupRoutes();
  }

  get httpServer() {
    return this._httpServer;
  }

  private async setupDbConnection() {
    mongoose.set('strictQuery', false);
    this.db.on('error', (error) => logger.error('mongoose:', error.message));
    this.db.once('open', () => logger.success('mongoose:', 'Connected to database'));
    await mongoose.connect(configService.isDev ? configService.env.DATABASE_URL_DEV! : configService.env.DATABASE_URL!);
  }

  private setupMiddleware() {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(
      cors({
        credentials: true,
        origin: true,
      }),
    );
    this.app.use(express.json({ limit: '500kb' }));
    this.app.use(history({}));
    this.app.use(cookieParser());
    this.app.use(hostRedirect);
    this.app.use(loggerMiddleware);
    this.app.use(history());

    if (configService.isProd) {
      if (configService.env.SENTRY_DSN) {
        Sentry.init({ dsn: configService.env.SENTRY_DSN });
        this.app.use(Sentry.Handlers.requestHandler());
        this.app.use(Sentry.Handlers.errorHandler());
      }
      const limiter = rateLimit({
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 1000, // limit each IP to 100 requests per windowMs
      });
      this.app.use(limiter);
      this.app.set('trust proxy', 1);
      this.app.use(secureRedirect);
    }
  }

  private setupRoutes() {
    this.app.use(subdomain('app', express.static('dist_app')));
    this.app.use(subdomain('static', express.static('public')));
    this.app.use(subdomain('api', apiRouter));
    this.app.use('/', express.static('dist_landingpage'));
  }

  start() {
    this.httpServer.listen(this.port, configService.isDev ? 'localhost.pro' : undefined, () =>
      logger.success(`Server started on port ${this.port} [${green(configService.env.NODE_ENV.toUpperCase())}]`),
    );
  }
}

const appService = new AppService();

export { appService };
