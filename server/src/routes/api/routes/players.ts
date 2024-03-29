import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { StratModel } from '@/models/strat';
import { PlayerModel } from '@/models/player';
import { uploadSingle, processImage, deleteFile } from '@/utils/fileUpload';
import { verifyAuth } from '@/utils/verifyToken';
import { sendMail, MailTemplate } from '@/utils/mailService';
import { profileUpdateSchema } from '@/utils/validation';
import { TypedServer } from '@/sockets/interfaces';
import { toPlayerDto } from '@/dto/player.dto';
import { TeamModel } from '@/models/team';

const router = Router();

// * Get User Profile
router.get('/', verifyAuth, (_req, res) => {
  return res.json(toPlayerDto(res.locals.player));
});

// * Update One
router.patch('/', verifyAuth, uploadSingle('avatar'), async (req, res) => {
  const { error } = profileUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    res.locals.player.password = hashedPassword;
  }

  if (req.file) {
    const fileName = await processImage(req.file, 200, 200);
    if (res.locals.player.avatar) {
      await deleteFile(res.locals.player.avatar);
    }
    res.locals.player.avatar = fileName;
  }

  if (req.body.name && req.query.updateStrats === 'true' && res.locals.player.team) {
    const strats = await StratModel.find({ team: res.locals.player.team });
    const promises = strats.map(async (strat) => {
      strat.content = strat.content?.replace(res.locals.player.name, req.body.name);
      await strat.save();
    });
    await Promise.all(promises);
  }

  if (req.body.name) {
    res.locals.player.name = req.body.name;
  }

  if (req.body.email) {
    const emailExists = await PlayerModel.findOne({ email: req.body.email });

    if (emailExists) return res.status(400).json({ error: 'Email already exists.' });

    const token = jwt.sign({ _id: res.locals.player._id, email: req.body.email }, process.env.EMAIL_SECRET!);
    await sendMail(req.body.email, token, res.locals.player.name, MailTemplate.VERIFY_CHANGE);
  }

  if (req.body.completedTutorial) {
    // TODO: check why we JSON.parse here
    res.locals.player.completedTutorial = JSON.parse(req.body.completedTutorial);
  }

  if (req.body.color) {
    res.locals.player.color = req.body.color;
  }

  const updatedPlayer = await res.locals.player.save();

  const updatedPlayerDto = toPlayerDto(updatedPlayer);

  res.json(updatedPlayerDto);

  if (updatedPlayer.team) {
    (req.app.get('io') as TypedServer)
      .to(updatedPlayer.team.toString())
      .emit('updated-player', { player: updatedPlayerDto });
  }
});

// * Update Color
router.patch('/color', verifyAuth, async (req, res) => {
  const team = await TeamModel.findById(res.locals.player.team);
  if (!team) return res.status(400).json({ error: 'Could not find team with the provided ID.' });

  const isSelf = res.locals.player._id.equals(req.body._id);
  const targetMember = isSelf ? res.locals.player : await PlayerModel.findById(req.body._id);

  if (!isSelf && !team.manager.equals(res.locals.player._id)) {
    return res.status(403).json({ error: 'Only the captain can change the color of other members.' });
  }

  targetMember.color = req.body.color;

  const updatedPlayer = await targetMember.save();
  const updatedPlayerDto = toPlayerDto(updatedPlayer);

  res.json(updatedPlayerDto);

  if (updatedPlayer.team) {
    (req.app.get('io') as TypedServer)
      .to(updatedPlayer.team.toString())
      .emit('updated-player', { player: updatedPlayerDto });
  }
});

export default router;
