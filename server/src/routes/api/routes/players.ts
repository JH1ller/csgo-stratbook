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

const router = Router();

// * Get User Profile
router.get('/', verifyAuth, (_req, res) => {
  const {
    _id,
    name,
    role,
    avatar,
    team,
    email,
    confirmed,
    isAdmin,
    createdAt,
    isOnline,
    lastOnline,
    completedTutorial,
  } = res.locals.player;

  res.json({
    _id,
    name,
    role,
    avatar,
    team,
    email,
    confirmed,
    isAdmin,
    createdAt,
    isOnline,
    lastOnline,
    completedTutorial,
  });
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

  if (req.body.name && req.query.updateStrats === 'true') {
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

  const updatedPlayer = await res.locals.player.save();

  const { email, password, deleted, modifiedAt, ...sanitizedPlayer } = updatedPlayer.toObject();

  res.json(sanitizedPlayer);
  (req.app.get('io') as TypedServer)
    .to(updatedPlayer.team.toString())
    .emit('updated-player', { player: sanitizedPlayer });
});

export default router;
