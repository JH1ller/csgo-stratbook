import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import { Router } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import ms from 'ms';
import { nanoid } from 'nanoid';
import SteamAuth from 'node-steam-openid';
import urljoin from 'url-join';

import { Path } from '@/constants';
import { PlayerDocument, PlayerModel } from '@/models/player';
import { SessionModel } from '@/models/session';
import { configService } from '@/services/config.service';
import { imageService } from '@/services/image.service';
import { mailService, MailTemplate } from '@/services/mail.service';
import { telegramService } from '@/services/telegram.service';
import { trackingService } from '@/services/tracking.service';
import { hasSessionConfig, refreshTokenConfig } from '@/utils/cookies';
import UserNotFoundError from '@/utils/errors/UserNotFoundError';
import { Logger } from '@/utils/logger';
import { registerSchema } from '@/utils/validation';
import { verifyAuth, verifyAuthOptional } from '@/utils/verifyToken';

const router = Router();

const logger = new Logger('AuthRoutes');

router.post('/register', imageService.upload.single('avatar'), async (request, res) => {
  const { error, data } = registerSchema.safeParse(request.body);
  if (error) {
    return res.status(400).json({ error: error.format()._errors[0] });
  }

  const normalizedEmail = data.email.toLowerCase();

  // TODO: run script to make all existing account emails lowercase and avoid regex query
  const emailExists = await PlayerModel.findOne({ email: new RegExp(normalizedEmail.replace('+', '\\+'), 'i') });

  if (emailExists) return res.status(400).json({ error: 'Email already exists.' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const user = new PlayerModel({
    name: data.name,
    email: normalizedEmail,
    password: hashedPassword,
  });

  if (request.file) {
    const fileName = await imageService.processImage(request.file, 200, 200);
    user.avatar = fileName;
  }

  const token = jwt.sign({ _id: user._id }, configService.env.EMAIL_SECRET);

  try {
    await mailService.sendMail(user.email, token, user.name, MailTemplate.VERIFY_NEW);
  } catch (error) {
    return res.json({ error: 'Error sending email. Please try again later.' });
  }

  await user.save();

  telegramService.send(`User ${user.name} registered.`);

  trackingService.setUser(user._id.toString(), {
    email: user.email,
    name: user.name,
  });

  res.json({ _id: user._id, email: user.email });
});

router.post('/login', async (request, res) => {
  const normalizedEmail = request.body.email.toLowerCase();
  const targetUser = await PlayerModel.findOne({ email: new RegExp(normalizedEmail.replace('+', '\\+'), 'i') });

  if (!targetUser) return res.status(400).json({ error: 'Email or password is invalid.' });

  const validPassword = await bcrypt.compare(request.body.password, targetUser.password);

  if (!validPassword) return res.status(400).json({ error: 'Email or password is invalid.' });

  if (targetUser.accountType === 'local' && !targetUser.confirmed)
    return res.status(401).send({ error: 'Please confirm your email to log in.' });

  const refreshToken = nanoid(64);
  const refreshTokenExpiration = new Date(Date.now() + ms(configService.env.REFRESH_TOKEN_TTL ?? '180d'));

  const session = new SessionModel({
    refreshToken,
    player: targetUser._id,
    expires: refreshTokenExpiration,
  });

  await session.save();

  const token = jwt.sign({ _id: targetUser._id }, configService.env.TOKEN_SECRET!, {
    expiresIn: configService.env.JWT_TOKEN_TTL ?? '1h',
  });

  res.cookie('refreshToken', refreshToken, refreshTokenConfig());

  res.cookie('hasSession', '1', hasSessionConfig());

  // TODO: evaluate if these headers are still needed
  res.set('Access-Control-Expose-Headers', 'Set-Cookie');
  res.set('Access-Control-Allow-Headers', 'Set-Cookie');

  res.json({
    token,
  });
});

router.post('/refresh', cookieParser(), async (request, res) => {
  const currentRefreshToken = request.body.refreshToken ?? request.cookies.refreshToken;

  const session = await SessionModel.findOne({ refreshToken: currentRefreshToken });
  if (!session) {
    res.clearCookie('refreshToken', refreshTokenConfig());
    res.clearCookie('hasSession', hasSessionConfig());
    return res.status(400).json({ error: 'Invalid refresh token' });
  }

  if (session.expires < new Date()) {
    session.remove();
    res.clearCookie('refreshToken', refreshTokenConfig());
    res.clearCookie('hasSession', hasSessionConfig());
    return res.status(400).json({ error: 'Refresh token expired' });
  }

  const refreshToken = nanoid(64);
  const refreshTokenExpiration = new Date(Date.now() + ms(configService.env.REFRESH_TOKEN_TTL ?? '180d'));

  session.refreshToken = refreshToken;
  session.expires = refreshTokenExpiration;

  await session.save();

  const token = jwt.sign({ _id: session.player }, configService.env.TOKEN_SECRET!, {
    expiresIn: configService.env.JWT_TOKEN_TTL ?? '1h',
  });

  res.cookie('refreshToken', refreshToken, refreshTokenConfig());

  res.cookie('hasSession', '1', hasSessionConfig());

  res.send({
    token,
  });
});

router.post('/logout', cookieParser(), async (request, res) => {
  const refreshToken = request.cookies.refreshToken;
  const session = await SessionModel.findOne({ refreshToken });
  if (!session) return res.status(400).json({ error: 'Invalid refresh token' });

  await SessionModel.findByIdAndRemove(session._id);

  res.clearCookie('refreshToken', refreshTokenConfig());
  res.clearCookie('hasSession', hasSessionConfig());

  res.send('Successfully logged out.');
});

router.delete('/', verifyAuth, async (_request, res) => {
  if (res.locals.player.avatar) {
    await imageService.deleteFile(res.locals.player.avatar);
  }

  await PlayerModel.findByIdAndRemove(res.locals.player._id);

  res.send('Successfully deleted account.');
});

router.get('/confirmation/:token', async (request, res) => {
  const { _id, email } = jwt.verify(request.params.token, configService.env.EMAIL_SECRET) as JwtPayload;
  const targetUser = await PlayerModel.findById(_id);

  if (!targetUser) {
    throw new UserNotFoundError(`confirm-email -> User "${_id}" not found. Email: ${email}`);
  }

  if (email) {
    targetUser.email = email;
    await targetUser.save();
    return res.redirect(urljoin(configService.getUrl(Path.app).toString(), `/profile?confirmed=1`));
  }

  if (targetUser.confirmed) {
    return res.redirect(
      urljoin(configService.getUrl(Path.app).toString(), `/login?already_confirmed=${targetUser.email}`),
    );
  } else {
    targetUser.confirmed = true;
    await targetUser.save();
    return res.redirect(urljoin(configService.getUrl(Path.app).toString(), `/login?confirmed=${targetUser.email}`));
  }
});

router.post('/forgot-password', async (request, res) => {
  const targetUser = await PlayerModel.findOne({ email: request.body.email.toLowerCase() });

  if (!targetUser) {
    return res.status(400).json({ error: 'Could not find user with that email address.' });
  }

  const token = jwt.sign({ _id: targetUser._id }, configService.env.EMAIL_SECRET!, { expiresIn: '2 days' });

  try {
    await mailService.sendMail(targetUser.email, token, targetUser.name, MailTemplate.RESET_PASSWORD);
  } catch (error) {
    logger.error('Error sending email', (error as Error).message);
    return res.json({ error: 'Error sending email. Please try again later.' });
  }

  return res.json(true);
});

router.patch('/reset', async (request, res) => {
  try {
    const { _id } = jwt.verify(request.body.token, configService.env.EMAIL_SECRET) as JwtPayload;

    const targetUser = await PlayerModel.findById(_id);
    if (!targetUser) {
      return res.status(401).json({ error: 'Player not found' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(request.body.password, salt);

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

router.get('/steam', verifyAuthOptional, async (request, res) => {
  const returnUrl = new URL(configService.getUrl(Path.api));
  returnUrl.pathname = '/api/auth/steam/authenticate';

  const urlQuery = new URLSearchParams();

  if (res.locals.player) {
    const token = jwt.sign({ _id: res.locals.player._id.toString() }, configService.env.TOKEN_SECRET, {
      expiresIn: '10m',
    });
    urlQuery.set('token', token);
  }

  returnUrl.search = urlQuery.toString();

  const steam = new SteamAuth({
    realm: configService.getUrl(Path.api).toString(),
    returnUrl: returnUrl.toString(),
    apiKey: configService.env.STEAM_API_KEY!,
  });

  const redirectUrl = await steam.getRedirectUrl();

  if (res.locals.player) {
    return res.send(redirectUrl);
  }

  logger.info('Redirecting to Steam login');

  return res.redirect(redirectUrl);
});

router.get('/steam/authenticate', async (request, res) => {
  const steam = new SteamAuth({
    realm: configService.getUrl(Path.api).toString(),
    returnUrl: urljoin(configService.getUrl(Path.api).toString(), '/auth/steam/authenticate'),
    apiKey: configService.env.STEAM_API_KEY!,
  });

  const steamUser = await steam.authenticate(request);

  let user = await PlayerModel.findOne({ steamId: steamUser.steamid });

  const redirectUrl = new URL(configService.getUrl(Path.app));

  if (request.query.token) {
    redirectUrl.pathname = '/profile';

    let player: PlayerDocument | null = null;

    try {
      const { _id } = jwt.verify(request.query.token as string, configService.env.TOKEN_SECRET) as JwtPayload;

      player = await PlayerModel.findById(_id);
    } catch (error) {
      logger.error('Invalid token', (error as Error).message);
      redirectUrl.searchParams.set('message', 'Player not found');
      return res.redirect(redirectUrl.toString());
    }

    if (!player) {
      redirectUrl.searchParams.set('message', 'Player not found');
      return res.redirect(redirectUrl.toString());
    }
    if (user) {
      logger.info(`Steam account ${steamUser.steamid} already linked to another user`);
      redirectUrl.searchParams.set('message', 'Steam account already linked to another user');
      return res.redirect(redirectUrl.toString());
    }

    player.steamId = steamUser.steamid;
    player.accountType = 'steam';
    await player.save();

    redirectUrl.searchParams.set('message', 'Steam account successfully linked');
    return res.redirect(redirectUrl.toString());
  }

  if (!user) {
    try {
      user = new PlayerModel({
        name: steamUser.username.slice(0, 20),
        avatar: steamUser.avatar.large,
        steamId: steamUser.steamid,
        accountType: 'steam',
      });

      await user.save();
    } catch (error) {
      logger.error('Error creating user', (error as Error).message);
      redirectUrl.searchParams.set('message', 'An error occurred while creating the user');
      return res.redirect(redirectUrl.toString());
    }
  }

  const refreshToken = nanoid(64);
  const refreshTokenExpiration = new Date(Date.now() + ms(configService.env.REFRESH_TOKEN_TTL ?? '180d'));

  const session = new SessionModel({
    refreshToken,
    player: user._id,
    expires: refreshTokenExpiration,
  });

  await session.save();

  res.set('Access-Control-Expose-Headers', 'Set-Cookie');
  res.set('Access-Control-Allow-Headers', 'Set-Cookie');

  res.cookie('refreshToken', refreshToken, refreshTokenConfig());
  res.cookie('hasSession', '1', hasSessionConfig());

  return res.redirect(redirectUrl.toString());
});

export default router;
