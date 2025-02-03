import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import { Router } from 'express';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken';
import ms from 'ms';
import { nanoid } from 'nanoid';
import SteamAuth from 'node-steam-openid';
import urljoin from 'url-join';

import { Path } from '@/constants';
import { PlayerModel } from '@/models/player';
import { SessionModel } from '@/models/session';
import { configService } from '@/services/config.service';
import { imageService } from '@/services/image.service';
import { mailService, MailTemplate } from '@/services/mail.service';
import { telegramService } from '@/services/telegram.service';
import { hasSessionConfig, refreshTokenConfig } from '@/utils/cookies';
import UserNotFoundError from '@/utils/errors/UserNotFoundError';
import { registerSchema } from '@/utils/validation';
import { verifyAuth, verifyAuthOptional } from '@/utils/verifyToken';

const router = Router();

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

  await user.save();
  await mailService.sendMail(user.email, token, user.name, MailTemplate.VERIFY_NEW);

  telegramService.send(`User ${user.name} registered.`);
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

  const electronMode = !!request.body.electronMode;

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
    refreshToken: electronMode ? refreshToken : undefined,
  });
});

router.post('/refresh', cookieParser(), async (request, res) => {
  const currentRefreshToken = request.body.refreshToken ?? request.cookies.refreshToken;

  console.log(currentRefreshToken);

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

  const electronMode = !!request.body.electronMode;

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
    refreshToken: electronMode ? refreshToken : undefined,
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
  const targetUser = await PlayerModel.findOne({ email: request.body.email });

  if (!targetUser) {
    return res.status(400).json({ error: 'Could not find user with that email address.' });
  }

  const token = jwt.sign({ _id: targetUser._id }, configService.env.EMAIL_SECRET!, { expiresIn: '2 days' });

  await mailService.sendMail(targetUser.email, token, targetUser.name, MailTemplate.RESET_PASSWORD);

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
  console.log(request.accepted, request.accepts('application/json'));
  const returnUrl = new URL(configService.getUrl(Path.api));
  returnUrl.pathname = '/api/auth/steam/authenticate';

  const urlQuery = new URLSearchParams();

  if (request.get('user-agent')?.includes('Electron')) {
    urlQuery.set('electronMode', 'true');
  }

  if (res.locals.player) {
    console.log('player found');
    urlQuery.set('playerId', res.locals.player._id.toString());
  }

  returnUrl.search = urlQuery.toString();

  console.log('returnUrl', returnUrl.toString());

  const steam = new SteamAuth({
    realm: configService.getUrl(Path.api).toString(),
    returnUrl: returnUrl.toString(),
    apiKey: configService.env.STEAM_API_KEY!,
  });

  const redirectUrl = await steam.getRedirectUrl();
  return res.send(redirectUrl);
});

router.get('/steam/authenticate', async (request, res) => {
  const electronMode = !!request.query.electronMode;

  const steam = new SteamAuth({
    realm: configService.getUrl(Path.api).toString(),
    returnUrl: urljoin(configService.getUrl(Path.api).toString(), '/auth/steam/authenticate'),
    apiKey: configService.env.STEAM_API_KEY!,
  });

  const steamUser = await steam.authenticate(request);

  console.log(steamUser);

  let user = await PlayerModel.findOne({ steamId: steamUser.steamid });

  if (request.query.playerId) {
    console.log('playerId', request.query.playerId);

    const redirectUrl = new URL(configService.getUrl(Path.app));

    const player = await PlayerModel.findById(request.query.playerId);

    redirectUrl.pathname = '/profile';

    if (!player) {
      redirectUrl.searchParams.set('message', 'Player not found');
      return res.redirect(redirectUrl.toString());
    }
    if (user) {
      redirectUrl.searchParams.set('message', 'Steam account already linked to another user');
      return res.redirect(redirectUrl.toString());
    }

    player.steamId = steamUser.steamid;
    player.accountType = 'steam';
    await player.save();

    if (electronMode) {
      return res.redirect(`stratbook://connect`);
    }

    redirectUrl.searchParams.set('message', 'Steam account successfully linked');
    return res.redirect(redirectUrl.toString());
  }

  if (!user) {
    user = new PlayerModel({
      name: steamUser.username,
      avatar: steamUser.avatar.large,
      steamId: steamUser.steamid,
      accountType: 'steam',
    });

    await user.save();
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

  if (electronMode) {
    return res.redirect(`stratbook://token/${refreshToken}`);
  } else {
    res.cookie('refreshToken', refreshToken, refreshTokenConfig());
    res.cookie('hasSession', '1', hasSessionConfig());
  }

  console.log(refreshToken);

  const redirectUrl = new URL(configService.getUrl(Path.app));

  return res.redirect(redirectUrl.toString());
});

export default router;
