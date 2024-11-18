/* eslint-disable unicorn/prefer-module */
import { createServer, Server } from 'node:http';
import path from 'node:path';

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
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: false,
          directives: {
            defaultSrc: [
              "'self'",
              'platform.twitter.com',
              'jstin.dev',
              'stratbook.pro',
              'localhost.pro',
              'ws:',
              'localhost',
            ],
            scriptSrc: ["'self'", 'cdn.splitbee.io', 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
            imgSrc: ["'self'", 'data:', 'csgo-stratbook.s3.amazonaws.com'],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
          },
          reportOnly: true,
        },
      }),
    );
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
    const proxyMiddleware = createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    });

    if (configService.isDev) {
      this.app.use((_, res, next) => {
        res.setHeader('Content-Security-Policy', "script-src 'self' 'unsafe-eval'");
        res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
        next();
      });
    }

    // API routes
    this.app.use('/api', apiRouter);

    // Serve static files for public assets
    this.app.use('/static', express.static('public'));

    if (configService.isDev) {
      this.app.use('/', proxyMiddleware);
    }

    // const appHistory = history({
    //   index: '/app/index.html',
    //   rewrites: [{ from: /^\/app\/.*$/, to: '/app/index.html' }],
    // });
    // const landingPageHistory = history({
    //   index: '/landingpage/index.html',
    //   rewrites: [{ from: /^\/landingpage\/.*$/, to: '/landingpage/index.html' }],
    // });

    const appStatic = express.static('client-build/app');
    this.app.use('/', appStatic);
    this.app.use(history({ verbose: true, index: 'client-build/app/index.html' }));
    // const landingPageStatic = express.static('client-build/landingpage');

    // // Serve landing page or fallback for other routes
    // this.app.use('/', (req, res, next) => {
    //   const { refreshToken, hasSession } = req.cookies;
    //   if (refreshToken || hasSession || configService.isDev) {
    //     logger.info('Serving app', refreshToken, hasSession);
    //     appHistory(req, res, () => appStatic(req, res, next));
    //   } else {
    //     logger.info('Serving landing page');
    //     landingPageHistory(req, res, () => landingPageStatic(req, res, next));
    //   }
    // });
  }

  start() {
    this.httpServer.listen(configService.port, configService.isDev ? configService.origin : undefined, () =>
      logger.success(
        `Server started. [${green(configService.env.NODE_ENV.toUpperCase())}] ${configService.urls.baseUrl.toString()}`,
      ),
    );
  }
}

const appService = new AppService();

export { appService };
