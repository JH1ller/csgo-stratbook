import { mkdir, unlink,writeFile } from 'node:fs/promises';
import path from 'node:path';

import { Router } from 'express';
import { nanoid } from 'nanoid';

import { updateStrats } from '@/controllers/strats';
import { Strat, StratDocument, StratModel } from '@/models/strat';
import { socketService } from '@/services/socket.service';
import { AccessRole } from '@/types/enums';
import { getStrat, getStrats } from '@/utils/getters';
import { verifyAuth } from '@/utils/verifyToken';

const router = Router();

router.get('/', verifyAuth, async (request, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  const strats: StratDocument[] = request.query.map
    ? await StratModel.find({ map: request.query.map, team: res.locals.player.team })
    : await StratModel.find({ team: res.locals.player.team });

  return res.json(strats);
});

// * Create One
router.post('/', verifyAuth, async (request, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }

  if (res.locals.player.role !== AccessRole.EDITOR) {
    return res.status(403).json({ error: 'Only editors can create strats' });
  }

  const strat = new StratModel({
    name: request.body.name,
    types: request.body.types,
    map: request.body.map,
    side: request.body.side,
    active: request.body.active,
    videoLink: request.body.videoLink,
    note: request.body.note,
    drawData: request.body.drawData,
    team: res.locals.player.team,
    createdBy: res.locals.player._id,
    createdAt: new Date(),
  });

  strat.$locals.playerId = res.locals.player._id;

  const newStrat = await strat.save();
  res.status(201).json(newStrat.toObject());
  socketService.to(newStrat.team.toString()).emit('created-strat', { strat: newStrat.toObject() });
});

// * Add shared
router.post('/share/:id', verifyAuth, async (request, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }

  if (res.locals.player.role !== AccessRole.EDITOR) {
    return res.status(403).json({ error: 'Only editors can add strats' });
  }

  const strat = await StratModel.findById(request.params.id);
  if (!strat || !strat.shared) {
    return res.status(400).json({ error: "Strat doesn't exist or hasn't been shared by owner." });
  }

  if (strat.team.equals(res.locals.player.team)) {
    return res.status(400).json({ error: 'This strat already exists in your teams stratbook' });
  }

  const stratCopy = new StratModel({
    ...strat.toObject<Strat>({
      transform: (_document, returnValue) => {
        delete returnValue._id;
        delete returnValue.team;
        delete returnValue.modifiedBy;
        delete returnValue.modifiedAt;
        delete returnValue.shared;
        return returnValue;
      },
    }),
    team: res.locals.player.team,
    createdBy: res.locals.player._id,
    createdAt: new Date(),
  });

  await stratCopy.save();
  res.status(201).json(stratCopy);
  socketService.to(stratCopy.team.toString()).emit('created-strat', { strat: stratCopy.toObject() });
});

// * Update One
router.patch('/', verifyAuth, getStrat, async (request, res) => {
  if (!res.locals.player.team.equals(res.locals.strat.team)) {
    return res.status(400).json({ error: 'Cannot update a strat of another team.' });
  }
  if (res.locals.player.role !== AccessRole.EDITOR) {
    return res.status(403).json({ error: 'Only editors can update strats' });
  }

  const updatedStrats = await updateStrats([res.locals.strat], [request.body]);
  res.json(updatedStrats[0]);
  socketService.to(updatedStrats[0].team.toString()).emit('updated-strat', { strat: updatedStrats[0].toObject() });
});

// * Update Multiple
router.patch('/batch', verifyAuth, getStrats, async (request, res) => {
  if (res.locals.strats.some((strat: Strat) => !res.locals.player.team.equals(strat.team))) {
    return res.status(400).json({ error: 'Cannot update a strat of another team.' });
  }
  if (res.locals.player.role !== AccessRole.EDITOR) {
    return res.status(403).json({ error: 'Only editors can update strats' });
  }

  const updatedStrats = await updateStrats(res.locals.strats, request.body);
  res.json(updatedStrats);
  socketService
    .to(updatedStrats[0].team.toString())
    .emit('updated-strats', { strats: updatedStrats.map((strat) => strat.toObject()) });
});

// * Delete One
router.delete('/:strat_id', verifyAuth, getStrat, async (request, res) => {
  if (!res.locals.player.team.equals(res.locals.strat.team)) {
    return res.status(400).json({ error: 'Cannot delete a strat of another team.' });
  }
  if (res.locals.player.role !== AccessRole.EDITOR) {
    return res.status(403).json({ error: 'Only editors can delete strats' });
  }
  await res.locals.strat.delete();
  res.json({ message: 'Deleted strat successfully' });
  socketService.to(res.locals.strat.team.toString()).emit('deleted-strat', { stratId: res.locals.strat._id });
});

// * Export to JSON
router.get('/export', verifyAuth, async (request, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  const strats = request.query.map
    ? await StratModel.find({ map: request.query.map, team: res.locals.player.team })
    : await StratModel.find({ team: res.locals.player.team });

  const stratsJson = JSON.stringify(strats, null, 2);

  await mkdir('temp', { recursive: true });

  const fileName = path.join(process.cwd(), 'temp', `JSON_export-${nanoid(5)}`);

  await writeFile(fileName, stratsJson);

  res.download(fileName, 'export.json', () => unlink(fileName));
});

export default router;
