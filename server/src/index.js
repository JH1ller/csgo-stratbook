require('dotenv').config();
const fs = require('fs');
const express = require('express');
require('express-async-errors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { pingInterval: 10000 });
const mongoose = require('mongoose');
const history = require('connect-history-api-fallback');
const cors = require('cors');
const port = process.env.PORT || 3000;
const { initWS } = require('./sockets');
const subdomain = require('express-subdomain');
const apiRouter = require('./routes/api');
const secureRedirect = require('./middleware/secureRedirect');
const logger = require('./middleware/logger');
require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development';

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set('useCreateIndex', true);

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
  history({
    index: '/dist_app/index.html',
  })
);

app.use((error, req, res, next) => {
  console.error('Error handler >>> ', error.message);
  res.status(500).json({ error: 'An error occured on the server.' });
});

// * allow all origins again
io.origins((_, callback) => {
  callback(null, true);
});

initWS(io);

app.set('io', io);

server.listen(port, null, () => console.log(`Server started on port ${port}`));
