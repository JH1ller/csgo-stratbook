import { Router } from 'express';
import { Strat, StratModel } from '@/models/strat';
import { getStrat, getStrats } from '@/utils/getters';
import { verifyAuth } from '@/utils/verifyToken';
import { TypedServer } from '@/sockets/interfaces';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';
import { updateStrats } from '@/controllers/strats';

const router = Router();

router.get('/', verifyAuth, async (req, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  const strats = req.query.map
    ? await StratModel.find({ map: req.query.map, team: res.locals.player.team })
    : await StratModel.find({ team: res.locals.player.team });

  const labelSet = strats.reduce<Set<string>>((acc, curr) => {
    for (const label of curr.labels) {
      acc.add(label);
    }
    return acc;
  }, new Set());

  const labelArr = [...labelSet];

  // res.json({
  //   strats,
  //   labels: labelArr,
  // });

  return res.json(strats);
});

// * Create One
router.post('/', verifyAuth, async (req, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }

  const strat = new StratModel({
    name: req.body.name,
    types: req.body.types,
    map: req.body.map,
    side: req.body.side,
    active: req.body.active,
    videoLink: req.body.videoLink,
    note: req.body.note,
    drawData: req.body.drawData,
    team: res.locals.player.team,
    createdBy: res.locals.player._id,
    createdAt: new Date(),
  });

  strat.$locals.playerId = res.locals.player._id;

  const newStrat = await strat.save();
  res.status(201).json(newStrat.toObject());
  (req.app.get('io') as TypedServer).to(newStrat.team.toString()).emit('created-strat', { strat: newStrat.toObject() });
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
    ...strat.toObject<Strat>({
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.team;
        delete ret.modifiedBy;
        delete ret.modifiedAt;
        delete ret.shared;
        return ret;
      },
    }),
    team: res.locals.player.team,
    createdBy: res.locals.player._id,
    createdAt: new Date(),
  });

  await stratCopy.save();
  res.status(201).json(stratCopy);
  (req.app.get('io') as TypedServer)
    .to(stratCopy.team.toString())
    .emit('created-strat', { strat: stratCopy.toObject() });
});

// * Update One
router.patch('/', verifyAuth, getStrat, async (req, res) => {
  if (!res.locals.player.team.equals(res.locals.strat.team)) {
    return res.status(400).json({ error: 'Cannot update a strat of another team.' });
  }

  const updatedStrats = await updateStrats([res.locals.strat], [req.body]);
  res.json(updatedStrats[0]);
  (req.app.get('io') as TypedServer)
    .to(updatedStrats[0].team.toString())
    .emit('updated-strat', { strat: updatedStrats[0].toObject() });
});

// * Update Multiple
router.patch('/batch', verifyAuth, getStrats, async (req, res) => {
  if (res.locals.strats.some((strat: Strat) => !res.locals.player.team.equals(strat.team))) {
    return res.status(400).json({ error: 'Cannot update a strat of another team.' });
  }

  const updatedStrats = await updateStrats(res.locals.strats, req.body);
  res.json(updatedStrats);
  (req.app.get('io') as TypedServer)
    .to(updatedStrats[0].team.toString())
    .emit('updated-strats', { strats: updatedStrats.map((strat) => strat.toObject()) });
});

// * Delete One
router.delete('/:strat_id', verifyAuth, getStrat, async (req, res) => {
  if (!res.locals.player.team.equals(res.locals.strat.team)) {
    return res.status(400).json({ error: 'Cannot delete a strat of another team.' });
  }
  await res.locals.strat.delete();
  res.json({ message: 'Deleted strat successfully' });
  (req.app.get('io') as TypedServer)
    .to(res.locals.strat.team.toString())
    .emit('deleted-strat', { stratId: res.locals.strat._id });
});

// * Export to JSON
router.get('/export', verifyAuth, async (req, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  const strats = req.query.map
    ? await StratModel.find({ map: req.query.map, team: res.locals.player.team })
    : await StratModel.find({ team: res.locals.player.team });

  const stratsJson = JSON.stringify(strats, null, 2);

  console.log(process.cwd());

  await mkdir('temp', { recursive: true });

  const fileName = path.join(process.cwd(), 'temp', `JSON_export-${nanoid(5)}`);

  await writeFile(fileName, stratsJson);

  res.download(fileName, 'export.json', () => unlink(fileName));
});

export default router;
