require('dotenv').config();

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const port = process.env.PORT || 3000;

mongoose.connect(
  process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL
    : process.env.DATABASE_URL_DEV,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

/**
 * Middleware
 */
app.use(express.json());
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(limiter);
app.use(helmet());

if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

/**
 * Routes
 */
app.get('/success', (req, res) => {
  res.render('success');
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

app.listen(port, () => console.log(`Server started on port ${port}`));
