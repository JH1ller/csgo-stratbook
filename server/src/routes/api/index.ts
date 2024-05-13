import { Router } from 'express';
const router = Router();

import authRouter from './routes/auth';
import noticesRouter from './routes/notices';
import playersRouter from './routes/players';
import stratsRouter from './routes/strats';
import teamsRouter from './routes/teams';
import utilitiesRouter from './routes/utilities';

router.use('/auth', authRouter);

router.use('/players', playersRouter);

router.use('/strats', stratsRouter);

router.use('/teams', teamsRouter);

router.use('/utilities', utilitiesRouter);

router.use('/notices', noticesRouter);

export default router;
