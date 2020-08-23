require('dotenv').config();

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 3000;
const { initWS } = require('./sockets/index');

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
app.use('/public', express.static('public'));
app.use(helmet());

if (process.env.NODE_ENV === 'production') {
  app.use(limiter);
  app.set('trust proxy', 1);
}

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

/**
 * Routes
 */
app.get('/success', (req, res) => {
  res.render('success');
});

app.get('/error', (req, res) => {
  res.render('error');
});

const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const mapsRouter = require('./routes/maps');
app.use('/maps', mapsRouter);

const playersRouter = require('./routes/players');
app.use('/players', playersRouter);

const stratsRouter = require('./routes/strats');
app.use('/strats', stratsRouter);

const stepsRouter = require('./routes/steps');
app.use('/steps', stepsRouter);

const teamsRouter = require('./routes/teams');
app.use('/teams', teamsRouter);

initWS(io);

server.listen(port, null, () => console.log(`Server started on port ${port}`));
