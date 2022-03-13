import { Router } from 'express';
import { StratModel } from '../../../models/strat';
import { getStrat } from '../../utils/getters';
import { verifyAuth } from '../../utils/verifyToken';
import { sanitize } from '../../utils/sanitizeHtml';
import { minifyHtml } from '../../utils/minifyHtml';

const router = Router();

router.get('/', verifyAuth, async (req, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  const strats = req.query.map
    ? await StratModel.find({ map: req.query.map, team: res.locals.player.team })
    : await StratModel.find({ team: res.locals.player.team });

  res.json(strats);
});

// * Create One
router.post('/', verifyAuth, async (req, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }

  const strat = new StratModel({
    name: req.body.name,
    // TODO: remove compatability fallback after noone is using <=1.8.8 anymore
    types: req.body.types ?? [req.body.type],
    map: req.body.map,
    side: req.body.side,
    active: req.body.active,
    videoLink: req.body.videoLink,
    note: req.body.note,
    team: res.locals.player.team,
    createdBy: res.locals.player._id,
    createdAt: Date.now(),
  });

  strat.$locals.playerId = res.locals.player._id;

  const newStrat = await strat.save();
  res.status(201).json(newStrat);
});

// * Add shared
router.post('/share/:id', verifyAuth, async (req, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }

  const strat = await StratModel.findById(req.params.id);
  if (!strat || !strat.shared) {
    return res.status(400).json({ error: "Strat doesn't exist or hasn't been shared by owner." });
  }

  if (strat.team.equals(res.locals.player.team)) {
    return res.status(400).json({ error: 'This strat already exists in your teams stratbook' });
  }

  const stratCopy = new StratModel({
    team: res.locals.player.team,
    name: strat.name,
    content: strat.content,
    note: strat.note,
    videoLink: strat.videoLink,
    side: strat.side,
    types: strat.types,
    map: strat.map,
    createdBy: res.locals.player._id,
    createdAt: Date.now(),
  });

  await stratCopy.save();
  res.status(201).json(stratCopy);
});

// * Update One
router.patch('/', verifyAuth, getStrat, async (req, res) => {
  if (!res.locals.player.team.equals(res.locals.strat.team)) {
    return res.status(400).json({ error: 'Cannot update a strat of another team.' });
  }
  const updatableFields = [
    'name',
    'map',
    'side',
    'types',
    'active',
    'videoLink',
    'note',
    'content',
    'shared',
    // TODO: probably remove this key because it's only updated on socket disconnect.
    'drawData',
  ];
  Object.entries(req.body).forEach(([key, value]) => {
    // check for undefined / null, but accept empty string ''
    if (value != null && updatableFields.includes(key)) {
      if (key === 'content') {
        res.locals.strat[key.toString()] = minifyHtml(sanitize(value as string));
      } else {
        res.locals.strat[key.toString()] = value;
      }
    }
  });
  const updatedStrat = await res.locals.strat.save();
  res.json(updatedStrat);
});

// * Delete One
router.delete('/:strat_id', verifyAuth, getStrat, async (req, res) => {
  if (!res.locals.player.team.equals(res.locals.strat.team)) {
    return res.status(400).json({ error: 'Cannot delete a strat of another team.' });
  }
  await res.locals.strat.delete();
  res.json({ message: 'Deleted strat successfully' });
});

export default router;
