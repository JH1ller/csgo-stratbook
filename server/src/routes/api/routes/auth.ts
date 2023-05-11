import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import ms from 'ms';
import { nanoid } from 'nanoid';
import cookieParser from 'cookie-parser';
import urljoin from 'url-join';
import { PlayerModel } from '@/models/player';
import { SessionModel } from '@/models/session';
import { registerSchema } from '@/utils/validation';
import { sendMail, MailTemplate } from '@/utils/mailService';
import { uploadSingle, processImage, deleteFile } from '@/utils/fileUpload';
import { APP_URL } from '@/config';
import { verifyAuth } from '@/utils/verifyToken';
import UserNotFoundError from '@/utils/errors/UserNotFoundError';
import { TelegramService } from '@/services/telegram.service';

const router = Router();
const telegramService = TelegramService.getInstance();

router.post('/register', uploadSingle('avatar'), async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const normalizedEmail = req.body.email.toLowerCase();

  // TODO: run script to make all existing account emails lowercase and avoid regex query
  const emailExists = await PlayerModel.findOne({ email: new RegExp(normalizedEmail, 'i') });

  if (emailExists) return res.status(400).json({ error: 'Email already exists.' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new PlayerModel({
    name: req.body.name,
    email: normalizedEmail,
    password: hashedPassword,
  });

  if (req.file) {
    const fileName = await processImage(req.file, 200, 200);
    user.avatar = fileName;
  }

  const token = jwt.sign({ _id: user._id }, process.env.EMAIL_SECRET!);

  await user.save();
  await sendMail(user.email, token, user.name, MailTemplate.VERIFY_NEW);

  telegramService.send(`User ${user.name} registered.`);
  res.json({ _id: user._id, email: user.email });
});

router.post('/login', async (req, res) => {
  const normalizedEmail = req.body.email.toLowerCase();
  const targetUser = await PlayerModel.findOne({ email: new RegExp(normalizedEmail, 'i') });

  if (!targetUser) return res.status(400).json({ error: 'Email or password is invalid.' });

  const validPassword = await bcrypt.compare(req.body.password, targetUser.password);

  if (!validPassword) return res.status(400).json({ error: 'Email or password is invalid.' });

  if (!targetUser.confirmed) return res.status(401).send({ error: 'Please confirm your email to log in.' });

  const refreshToken = nanoid(64);
  const refreshTokenExpiration = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_TTL ?? '180d'));

  const jsonMode = !!req.body.jsonMode;

  const session = new SessionModel({
    refreshToken,
    player: targetUser._id,
    expires: refreshTokenExpiration,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
  });

  await session.save();

  const token = jwt.sign({ _id: targetUser._id }, process.env.TOKEN_SECRET!, {
    expiresIn: process.env.JWT_TOKEN_TTL ?? '1h',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: ms(process.env.REFRESH_TOKEN_TTL ?? '180d'),
    sameSite: 'lax',
  });

  // TODO: evaluate if these headers are still needed
  res.set('Access-Control-Expose-Headers', 'Set-Cookie');
  res.set('Access-Control-Allow-Headers', 'Set-Cookie');

  // TODO: check why we're using send() instead of json()
  res.send({
    token,
    refreshToken: jsonMode ? refreshToken : undefined,
  });
});

router.post('/refresh', cookieParser(), async (req, res) => {
  const currentRefreshToken = req.cookies.refreshToken ?? req.body.refreshToken;
  const session = await SessionModel.findOne({ refreshToken: currentRefreshToken });
  if (!session) return res.status(400).json({ error: 'Invalid refresh token' });

  if (session.expires < new Date()) {
    session.remove();
    return res.status(400).json({ error: 'Refresh token expired' });
  }

  const jsonMode = !!req.body.jsonMode;

  const refreshToken = nanoid(64);
  const refreshTokenExpiration = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_TTL ?? '180d'));

  session.refreshToken = refreshToken;
  session.expires = refreshTokenExpiration;
  session.userAgent = req.cookies.userAgent;

  await session.save();

  const token = jwt.sign({ _id: session.player }, process.env.TOKEN_SECRET!, {
    expiresIn: process.env.JWT_TOKEN_TTL ?? '1h',
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: ms(process.env.REFRESH_TOKEN_TTL ?? '180d'),
    sameSite: 'lax',
  });

  res.send({
    token,
    refreshToken: jsonMode ? refreshToken : undefined,
  });
});

router.post('/logout', cookieParser(), async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const session = await SessionModel.findOne({ refreshToken });
  if (!session) return res.status(400).json({ error: 'Invalid refresh token' });

  await SessionModel.findByIdAndRemove(session._id);

  res.send('Successfully logged out.');
});

router.delete('/', verifyAuth, async (_req, res) => {
  if (res.locals.player.avatar) {
    await deleteFile(res.locals.player.avatar);
  }

  await PlayerModel.findByIdAndRemove(res.locals.player._id);

  res.send('Successfully deleted account.');
});

router.get('/confirmation/:token', async (req, res) => {
  const { _id, email } = jwt.verify(req.params.token, process.env.EMAIL_SECRET!) as JwtPayload;
  const targetUser = await PlayerModel.findById(_id);

  if (!targetUser) {
    throw new UserNotFoundError(`confirm-email -> User "${_id}" not found. Email: ${email}`);
  }

  if (email) {
    targetUser.email = email;
    await targetUser.save();
    return res.redirect(urljoin(APP_URL, `/#/profile?confirmed=1`));
  }

  if (targetUser.confirmed) {
    return res.redirect(urljoin(APP_URL, `/#/login?already_confirmed=${targetUser.email}`));
  } else {
    targetUser.confirmed = true;
    await targetUser.save();
    return res.redirect(urljoin(APP_URL, `/#/login?confirmed=${targetUser.email}`));
  }
});

router.post('/forgot-password', async (req, res) => {
  const targetUser = await PlayerModel.findOne({ email: req.body.email });

  if (!targetUser) {
    return res.status(400).json({ error: 'Could not find user with that email address.' });
  }

  const token = jwt.sign({ _id: targetUser._id }, process.env.EMAIL_SECRET!, { expiresIn: '2 days' });

  await sendMail(targetUser.email, token, targetUser.name, MailTemplate.RESET_PASSWORD);

  return res.json(true);
});

router.patch('/reset', async (req, res) => {
  try {
    const { _id } = jwt.verify(req.body.token, process.env.EMAIL_SECRET!) as JwtPayload;

    const targetUser = await PlayerModel.findById(_id);
    if (!targetUser) {
      return res.status(401).json({ error: 'Player not found' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    targetUser.password = hashedPassword;
    await targetUser.save();
    return res.json(true);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(400).json({ error: 'Reset link expired.' });
    }
    return res.status(400).json({ error: 'Invalid reset link' });
  }
});

export default router;
