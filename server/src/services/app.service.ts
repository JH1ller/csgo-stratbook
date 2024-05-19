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
import { createProxyMiddleware } from 'http-proxy-middleware';
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

  private db = mongoose.connection;

  constructor() {
    this.app = express();
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
    this.app.use(cookieParser());
    this.app.use(hostRedirect);
    this.app.use(loggerMiddleware);

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
    if (configService.isDev) {
      this.app.use((_, res, next) => {
        res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-eval'");
        res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
        next();
      });
      this.app.use(
        subdomain(
          'app',
          createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            // logger,
            secure: false,
          }),
        ),
      );
    } else {
      this.app.use(subdomain('app', express.static('dist_app')));
    }
    this.app.use(subdomain('api', apiRouter));
    this.app.use(subdomain('static', express.static('public')));
    this.app.use('/', express.static('dist_landingpage'));
    this.app.use(history());
  }

  start() {
    this.httpServer.listen(configService.port, configService.origin, () =>
      logger.success(
        `Server started. [${green(configService.env.NODE_ENV.toUpperCase())}] ${configService.urls.baseUrl.toString()}`,
      ),
    );
  }
}

const appService = new AppService();

export { appService };
