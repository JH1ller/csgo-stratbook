require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(
    process.env.NODE_ENV === 'production'
        ? process.env.DATABASE_URL
        : process.env.DATABASE_URL_DEV,
    { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on('error', () => console.error(error));
db.once('open', () => console.log('Connected to database'));

app.use(express.json());
app.use(cors());

const mapsRouter = require('./routes/maps');
app.use('/maps', mapsRouter);

const playersRouter = require('./routes/players');
app.use('/players', playersRouter);

const stratsRouter = require('./routes/strats');
app.use('/strats', stratsRouter);

app.listen(3000, () => console.log('Server started'))