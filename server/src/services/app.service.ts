/* eslint-disable unicorn/prefer-module */
import { createServer, Server } from 'node:http';

import * as Sentry from '@sentry/node';
import { green } from 'colors';
import compression from 'compression';
import history from 'connect-history-api-fallback';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import mongoose from 'mongoose';

import { CSP_HEADER, Path, PUBLIC_PATHS } from '@/constants';

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
    this.setupGracefulShutdown();
  }

  get httpServer() {
    return this._httpServer;
  }

  private async setupDbConnection() {
    mongoose.set('strictQuery', false);
    this.db.on('error', (error) => logger.error('mongoose:', error.message));
    this.db.once('open', () => logger.success('mongoose:', 'Connected to database'));
    await mongoose.connect(configService.isDev ? configService.env.DATABASE_URL_DEV! : configService.env.DATABASE_URL);
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
    this.app.use((_, res, next) => {
      res.setHeader('Content-Security-Policy', CSP_HEADER);
      next();
    });

    // API routes
    this.app.use('/api', apiRouter);

    // Serve static files for public assets
    this.app.use('/static', express.static('public'));

    this.app.use('/home', express.static('client-build/landingpage'));

    if (configService.isDev) {
      const clientProxy = createProxyMiddleware({
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
      });
      this.app.use('/', clientProxy);
    }

    // Middleware to check if the user is logged in
    this.app.use((req, res, next) => {
      const refreshToken = req.cookies.refreshToken;

      // Allow access to public paths without checking for login
      if (PUBLIC_PATHS.some((path) => req.path.startsWith(path))) {
        return next();
      }

      // If the user is not logged in, redirect to /home
      if (!refreshToken && req.headers.accept?.includes('text/html')) {
        return res.redirect('/home');
      }

      // If the user is logged in, proceed to the next middleware
      next();
    });

    this.app.use(history({ verbose: false }));

    this.app.use('/', express.static('client-build/app'));
  }

  start() {
    this.httpServer.listen(configService.port, undefined, () =>
      logger.success(
        `Server started. [${green(configService.env.NODE_ENV.toUpperCase())}] ${configService.getUrl(Path.app)}`,
      ),
    );
  }

  private setupGracefulShutdown() {
    const shutdown = async () => {
      logger.info('Shutting down server...');
      await mongoose.connection.close();
      this.httpServer.close(() => {
        logger.info('Server shut down successfully');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }
}

const appService = new AppService();

export { appService };
