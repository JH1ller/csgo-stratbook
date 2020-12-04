const express = require('express');
const router = express.Router();

const authRouter = require('./routes/auth');
const playersRouter = require('./routes/players');
const stratsRouter = require('./routes/strats');
const teamsRouter = require('./routes/teams');
const utilitiesRouter = require('./routes/utilities');


router.use('/auth', authRouter);

router.use('/players', playersRouter);

router.use('/strats', stratsRouter);

router.use('/teams', teamsRouter);

router.use('/utilities', utilitiesRouter);

module.exports = router;