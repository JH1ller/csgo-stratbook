require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import historyFallback from 'connect-history-api-fallback';
import cors from 'cors';
import subdomain from 'express-subdomain';
import { initialize } from './sockets';
import apiRouter from './routes/api';
import { secureRedirect } from './middleware/secureRedirect';
import { logger } from './middleware/logger';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  pingInterval: 10000,
  cors: {
    origin: ['https://stratbook.live', 'http://localhost:8080'],
  },
});
const port = process.env.PORT || 3000;

const isDev = process.env.NODE_ENV === 'development';

mongoose.connect(isDev ? process.env.DATABASE_URL_DEV! : process.env.DATABASE_URL!, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});

if (!isDev) {
  app.use(limiter);
  app.set('trust proxy', 1);
  app.use(secureRedirect);
}

app.use(express.json({ limit: '500kb' }));

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use(helmet());

app.use(compression());

app.use(logger);

if (isDev) {
  app.use('/static', express.static('public'));
  app.use('/api', apiRouter);
  app.use('/app', express.static('dist_app'));
  app.use('/', express.static('dist_landingpage'));
} else {
  app.use(subdomain('static', express.static('public')));
  app.use(subdomain('app', express.static('dist_app')));
  app.use(subdomain('api', apiRouter));
  app.use('/.well-known/pki-validation/', express.static('cert'));
  app.use('/', express.static('dist_landingpage'));
}

app.use(
  historyFallback({
    index: '/dist_app/index.html',
  })
);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error handler >>> ', error.message);
  res.status(500).json({ error: 'An error occured on the server.' });
});

// * allow all origins again
// io.origins((_, callback) => {
//   callback(null, true);
// });

initialize(io);

//app.set('io', io);

httpServer.listen(port, undefined, () => console.log(`Server started on port ${port}`));
