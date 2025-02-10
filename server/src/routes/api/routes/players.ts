import bcrypt from 'bcryptjs';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { toPlayerDto } from '@/dto/player.dto';
import { PlayerModel } from '@/models/player';
import { StratModel } from '@/models/strat';
import { TeamModel } from '@/models/team';
import { configService } from '@/services/config.service';
import { imageService } from '@/services/image.service';
import { mailService, MailTemplate } from '@/services/mail.service';
import { socketService } from '@/services/socket.service';
import { formatFirstError, profileUpdateSchema } from '@/utils/validation';
import { verifyAuth } from '@/utils/verifyToken';

const router = Router();

// * Get User Profile
router.get('/', verifyAuth, (_request, res) => {
  return res.json(toPlayerDto(res.locals.player));
});

// * Update One
router.patch('/', verifyAuth, imageService.upload.single('avatar'), async (request, res) => {
  const { error, data } = profileUpdateSchema.safeParse(request.body);
  if (error) {
    return res.status(400).json({ error: formatFirstError(error) });
  }

  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    res.locals.player.password = hashedPassword;
  }

  if (request.file) {
    const fileName = await imageService.processImage(request.file, 200, 200);
    if (res.locals.player.avatar) {
      await imageService.deleteFile(res.locals.player.avatar);
    }
    res.locals.player.avatar = fileName;
  }

  if (data.name && request.query.updateStrats === 'true' && res.locals.player.team) {
    const strats = await StratModel.find({ team: res.locals.player.team });
    const promises = strats.map(async (strat) => {
      strat.content = strat.content?.replace(res.locals.player.name, data.name!);
      await strat.save();
    });
    await Promise.all(promises);
  }

  if (data.name) {
    res.locals.player.name = data.name;
  }

  if (data.email) {
    const emailExists = await PlayerModel.findOne({ email: data.email });

    if (emailExists) return res.status(400).json({ error: 'Email already exists.' });

    const token = jwt.sign({ _id: res.locals.player._id, email: data.email }, configService.env.EMAIL_SECRET);
    await mailService.sendMail(data.email, token, res.locals.player.name, MailTemplate.VERIFY_CHANGE);
  }

  if (data.completedTutorial) {
    res.locals.player.completedTutorial = data.completedTutorial;
  }

  if (data.color) {
    res.locals.player.color = data.color;
  }

  const updatedPlayer = await res.locals.player.save();

  const updatedPlayerDto = toPlayerDto(updatedPlayer);

  res.json(updatedPlayerDto);

  if (updatedPlayer.team) {
    socketService.to(updatedPlayer.team.toString()).emit('updated-player', { player: updatedPlayerDto });
  }
});

// * Update Color
router.patch('/color', verifyAuth, async (request, res) => {
  const team = await TeamModel.findById(res.locals.player.team);
  if (!team) return res.status(400).json({ error: 'Could not find team with the provided ID.' });

  const isSelf = res.locals.player._id.equals(request.body._id);
  const targetMember = isSelf ? res.locals.player : await PlayerModel.findById(request.body._id);

  if (!isSelf && !team.manager.equals(res.locals.player._id)) {
    return res.status(403).json({ error: 'Only the captain can change the color of other members.' });
  }

  targetMember.color = request.body.color;

  const updatedPlayer = await targetMember.save();
  const updatedPlayerDto = toPlayerDto(updatedPlayer);

  res.json(updatedPlayerDto);

  if (updatedPlayer.team) {
    socketService.to(updatedPlayer.team.toString()).emit('updated-player', { player: updatedPlayerDto });
  }
});

// * Update role
router.patch('/role', verifyAuth, async (request, res) => {
  const team = await TeamModel.findById(res.locals.player.team);
  if (!team) return res.status(400).json({ error: 'Could not find team with the provided ID.' });

  const isSelf = res.locals.player._id.equals(request.body._id);
  const isManager = team.manager.equals(res.locals.player._id);

  if (!isManager) {
    return res.status(403).json({ error: 'Only the captain can change the access role of other members.' });
  }

  if (isSelf) {
    return res.status(400).json({ error: 'A captain cannot remove their editing rights.' });
  }

  const targetMember = await PlayerModel.findById(request.body._id);

  if (!targetMember) return res.status(400).json({ error: 'Could not find player with the provided ID.' });

  targetMember.role = request.body.role;

  const updatedPlayer = await targetMember.save();
  const updatedPlayerDto = toPlayerDto(updatedPlayer);

  res.json(updatedPlayerDto);

  if (updatedPlayer.team) {
    socketService.to(updatedPlayer.team.toString()).emit('updated-player', { player: updatedPlayerDto });
  }
});

export default router;
