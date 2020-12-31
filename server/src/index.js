require('dotenv').config();

const express = require('express');
require('express-async-errors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
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

mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : process.env.DATABASE_URL_DEV, {
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

/**
 * Middleware
 */

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(subdomain('static', express.static('public')));

app.use('/.well-known/pki-validation/', express.static('cert'));

app.use(subdomain('app', express.static('dist')));
app.use('/', express.static('dist'));
app.use(
  history({
    index: '/dist/index.html',
  })
);

app.use(subdomain('api', apiRouter));

if (process.env.NODE_ENV === 'production') {
  app.use(limiter);
  app.set('trust proxy', 1);
}

app.use((error, req, res, next) => {
  console.error('Error handler >>> ', error.message);
  res.status(500).json({ error: 'An error occured on the server.' });
});

/**
 * Routes
 */

initWS(io);

app.set('io', io);

server.listen(port, null, () => console.log(`Server started on port ${port}`));
