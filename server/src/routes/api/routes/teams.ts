/* eslint-disable no-constant-condition */
import crypto from 'node:crypto';

import { Router } from 'express';

import { COLORS } from '@/constants';
import { toPlayerDto } from '@/dto/player.dto';
import { toTeamDto } from '@/dto/team.dto';
import { PlayerModel } from '@/models/player';
import { StratModel } from '@/models/strat';
import { TeamModel } from '@/models/team';
import { imageService } from '@/services/image.service';
import { socketService } from '@/services/socket.service';
import { telegramService } from '@/services/telegram.service';
import { AccessRole } from '@/types/enums';
import { getRandomColor } from '@/utils/colors';
import { teamSchema } from '@/utils/validation';
import { verifyAuth } from '@/utils/verifyToken';

const router = Router();

router.get('/', verifyAuth, async (_, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ message: "Player doesn't have a team" });
  }
  const team = await TeamModel.findById(res.locals.player.team);
  if (team) {
    return res.json(toTeamDto(team));
  } else {
    res.status(400).json({ message: 'Team not found.' });
  }
});

router.get('/players', verifyAuth, async (_, res) => {
  const members = await PlayerModel.find({ team: res.locals.player.team });
  const memberDtos = members.map((member) => toPlayerDto(member));
  res.json(memberDtos);
});

// * Create One
router.post('/', verifyAuth, imageService.upload.single('avatar'), async (request, res) => {
  const { error, data } = teamSchema.safeParse(request.body);
  if (error) {
    return res.status(400).send({ error: error.format()._errors[0] });
  }

  const teamExists = await TeamModel.findOne({ name: data.name });

  if (teamExists) return res.status(400).send({ error: 'Team name already exists' });

  const team = new TeamModel({
    name: data.name,
    createdBy: res.locals.player._id,
    manager: res.locals.player._id,
    website: data.website,
    server: {
      ip: data.serverIp,
      password: data.serverPw,
    },
  });

  let code;

  while (true) {
    code = crypto.randomBytes(3).toString('hex');
    if (!(await TeamModel.findOne({ code }))) break;
  }

  team.code = code;

  if (request.file) {
    const fileName = await imageService.processImage(request.file, 200, 200);
    team.avatar = fileName;
  }

  const newTeam = await team.save();

  res.locals.player.color = COLORS[0];
  res.locals.player.team = newTeam._id;
  const updatedPlayer = await res.locals.player.save();

  telegramService.send(`Team ${newTeam.name} created.`);

  res.status(201).json(toPlayerDto(updatedPlayer));
});

// * Update One
router.patch('/', verifyAuth, imageService.upload.single('avatar'), async (request, res) => {
  const team = await TeamModel.findById(res.locals.player.team);

  if (!team) return res.status(400).json({ error: 'Could not find team with the provided ID.' });
  if (!res.locals.player._id.equals(team.manager))
    return res.status(401).json({ error: 'Only the team manager can edit team details.' });

  if (request.file) {
    const fileName = await imageService.processImage(request.file, 200, 200);
    if (team.avatar) {
      await imageService.deleteFile(team.avatar);
    }
    team.avatar = fileName;
  }

  if (request.body.name) team.name = request.body.name;

  if (request.body.website) team.website = request.body.website;

  // TODO: test if this still works and if it's even needed this way
  if (request.body.serverIp)
    await TeamModel.updateOne({ _id: team._id }, { $set: { 'server.ip': request.body.serverIp } });
  if (request.body.serverPw)
    await TeamModel.updateOne({ _id: team._id }, { $set: { 'server.password': request.body.serverPw } });

  const updatedTeam = await team.save();

  res.json(toTeamDto(updatedTeam));
  socketService.to(team._id.toString()).emit('updated-team', { team: updatedTeam.toObject() });
});

// * Delete One
router.delete('/', verifyAuth, async (request, res) => {
  const team = await TeamModel.findById(res.locals.player.team);
  if (!team) return res.status(400).json({ error: 'Could not find team with the provided ID.' });

  if (!team.manager.equals(res.locals.player._id))
    return res.status(403).json({ error: 'This action requires higher privileges.' });

  await team.delete();

  const members = await PlayerModel.find({ team: team._id });
  const memberPromises = members.map(async (member) => {
    member.team = undefined;
    return member.save();
  });
  await Promise.all(memberPromises);

  const strats = await StratModel.find({ team: team._id });
  const stratPromises = strats.map(async (strat) => {
    return strat.delete();
  });
  await Promise.all(stratPromises);

  res.json(toPlayerDto(res.locals.player));
  socketService.to(team._id.toString()).emit('deleted-team');
});

// * Join team
router.patch('/join', verifyAuth, async (request, res) => {
  const team = await TeamModel.findOne({ code: request.body.code });

  if (!team) {
    return res.status(400).json({ error: 'Wrong join code' });
  }
  const members = await PlayerModel.find({ team: team._id });

  const color = COLORS.find((color) => !members.some((member) => member.color === color)) ?? getRandomColor();

  res.locals.player.color = color;
  res.locals.player.team = team._id;
  res.locals.player.role = AccessRole.VIEWER;

  const updatedPlayer = await res.locals.player.save();
  return res.json(toPlayerDto(updatedPlayer));
});

// * Leave team
router.patch('/leave', verifyAuth, async (request, res) => {
  const team = await TeamModel.findById(res.locals.player.team);

  if (!team) return res.status(400).json({ error: 'Could not find team with the provided ID.' });

  const members = await PlayerModel.find({ team: team._id });

  if (members.length > 1) {
    if (team.manager.equals(res.locals.player._id)) {
      return res.status(400).json({ error: 'You need to transfer leadership first.' });
    }

    let code;

    while (true) {
      code = crypto.randomBytes(3).toString('hex');
      if (!(await TeamModel.findOne({ code }))) break;
    }

    team.code = code;

    await team.save();
  } else {
    await team.delete();
  }

  res.locals.player.team = undefined;

  const updatedPlayer = await res.locals.player.save();
  return res.json(toPlayerDto(updatedPlayer));
});

// * Transfer leader
router.patch('/transfer', verifyAuth, async (request, res) => {
  const team = await TeamModel.findById(res.locals.player.team);

  if (!team) return res.status(400).json({ error: 'Could not find team with the provided ID.' });

  if (!res.locals.player._id.equals(team.manager)) {
    return res.status(403).json({ error: 'Only a team manager can transfer leadership.' });
  }

  if (team.manager.equals(request.body._id)) {
    return res.status(400).json({ error: 'Selected player is already team manager.' });
  }

  team.manager = request.body._id;

  const updatedTeam = await team.save();
  return res.json(toTeamDto(updatedTeam));
});

// * Kick member
router.patch('/kick', verifyAuth, async (request, res) => {
  const team = await TeamModel.findById(res.locals.player.team);

  if (!team) return res.status(400).json({ error: 'Could not find team with the provided ID.' });

  const target = await PlayerModel.findById(request.body._id);

  if (!target) return res.status(400).json({ error: 'Could not find target with the provided ID.' });

  if (!res.locals.player._id.equals(team.manager)) {
    return res.status(400).json({ error: 'Only a team manager can kick players.' });
  }

  if (!target.team?.equals(team._id)) {
    return res.status(400).json({ error: 'Cannot kick player from another team.' });
  }

  if (target._id.equals(team.manager)) {
    return res.status(400).json({ error: 'Cannot kick the team manager.' });
  }

  //* move generate new code logic into util function
  let code;

  while (true) {
    code = crypto.randomBytes(3).toString('hex');
    if (!(await TeamModel.findOne({ code }))) break;
  }

  team.code = code;

  target.team = undefined;

  await target.save();
  await team.save();
  return res.json({ success: `Player ${target.name} was kicked from the team.` });
});

export default router;
