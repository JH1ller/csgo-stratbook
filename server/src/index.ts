import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { createServer, IncomingMessage } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import subdomain from 'express-subdomain';
import { initialize } from './sockets';
import apiRouter from './routes/api';
import { secureRedirect } from './middleware/secureRedirect';
import { logger } from './middleware/logger';
import * as Sentry from '@sentry/node';
import { green } from 'colors';
import { Log } from './utils/logger';
import { instrument } from '@socket.io/admin-ui';
import { hashSync } from 'bcryptjs';
import { TelegramService } from './services/telegram.service';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingInterval: 10000,
  cors: {
    origin: [
      'https://stratbook.live',
      'https://stratbook.pro',
      'app://.',
      'https://app.stratbook.live',
      'https://app.stratbook.pro',
      'http://localhost:8080',
      'http://192.168.0.11:8080',
      'http://csstrats-app.herokuapp.com/',
      'https://admin.socket.io',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const port = process.env.PORT || 3000;

const isDev = process.env.NODE_ENV === 'development';

mongoose.set('strictQuery', false);

mongoose.connect(isDev ? process.env.DATABASE_URL_DEV! : process.env.DATABASE_URL!);

const db = mongoose.connection;
db.on('error', (error) => Log.error('mongoose', error.message));
db.once('open', () => Log.success('mongoose', 'Connected to database'));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});

if (!isDev) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  app.use(Sentry.Handlers.requestHandler());

  app.use(limiter);
  app.set('trust proxy', 1);
  app.use(secureRedirect);
}

app.use(express.json({ limit: '500kb' }));

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);

app.use(helmet());

app.use(compression());

app.use(logger);

const hostRedirect: RequestHandler = (req, res, next) => {
  const host = req.headers.host;
  // shouldn't happen, but still check to prevent DOS
  if (!host) return next();

  if (host === 'map.stratbook.pro') {
    return res.redirect('https://app.stratbook.pro/#/map');
  }

  if (host.startsWith('www.')) {
    return res.redirect(301, 'https://stratbook.pro');
  }

  const redirectTlds = ['.live', '.app'];

  const matchingTld = redirectTlds.find((tld) => req.headers.host?.endsWith(tld));
  if (!matchingTld) return next();

  const [hostWithoutTld] = host.split(matchingTld);

  const targetUrl = 'https://' + hostWithoutTld + '.pro' + req.url;

  return res.redirect(301, targetUrl);
};

app.use(hostRedirect);

if (isDev) {
  app.use('/app', express.static('dist_app'));
  app.use('/static', express.static('public'));
  app.use('/api', apiRouter);
} else {
  app.use(subdomain('app', express.static('dist_app')));
  app.use(subdomain('static', express.static('public')));
  app.use(subdomain('api', apiRouter));
  app.use('/.well-known/pki-validation/', express.static('cert'));
}

app.use('/', express.static('dist_landingpage'));

if (!isDev) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use((error: unknown, _: Request, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    Log.error('error::middleware', error.message);
    return res.status(500).json({ error: 'An error occured on the server.' });
  } else if (error instanceof IncomingMessage) {
    Log.error('error::middleware', `Error trying to fetch ${error.url}`);
    next(error);
  }
});

app.set('io', io);

initialize(io);

if (!isDev) TelegramService.getInstance().init(process.env.TELEGRAM_TOKEN!, process.env.TELEGRAM_USER!);

//* setup connection to socket.io admin UI
instrument(io, {
  auth: {
    type: 'basic',
    username: 'admin',
    password: hashSync(process.env.SOCKET_ADMIN_UI_PW!, 10),
  },
});

httpServer.listen(port, undefined, () =>
  Log.success('httpServer::listen', `Server started on port ${port} [${green(process.env.NODE_ENV!.toUpperCase())}]`),
);
