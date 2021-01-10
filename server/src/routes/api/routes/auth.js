const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ms = require('ms');
const nanoid = require('nanoid');
const router = express.Router();
const Player = require('../../../models/player');
const Session = require('../../../models/session');
const Key = require('../../../models/key');
const urljoin = require('url-join');
const { registerValidation } = require('../../utils/validation');
const { sendMail, Templates } = require('../../utils/mailService');
const { uploadSingle, processImage } = require('../../utils/fileUpload');
const { APP_URL } = require('../../../config');

/**
 * * Routes
 */

router.post('/register', uploadSingle('avatar'), async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const emailExists = await Player.findOne({ email: req.body.email });

  if (emailExists) return res.status(400).json({ error: 'Email already exists.' });

  const targetKey = await Key.findOne({ key: req.body.key });

  if (!targetKey) return res.status(400).json({ error: 'The provided key is invalid.' });

  if (targetKey.remainingUses <= 0) return res.status(400).json({ error: 'The provided key has no uses left.' });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new Player({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  if (req.file) {
    user.avatar = req.file.filename;
    await processImage(req.file);
  }

  const token = jwt.sign({ _id: user._id }, process.env.EMAIL_SECRET);

  targetKey.remainingUses--;
  targetKey.usedBy.push(user._id);
  targetKey.usedAt.push(Date.now());
  await targetKey.save();
  await user.save();
  await sendMail(user.email, token, user.name, Templates.verifyNew);

  res.json({ _id: user._id, email: user.email });
});

router.post('/login', async (req, res) => {
  const targetUser = await Player.findOne({ email: req.body.email });

  if (!targetUser) return res.status(400).json({ error: 'Email or password is invalid.' });

  const validPassword = await bcrypt.compare(req.body.password, targetUser.password);

  if (!validPassword) return res.status(400).json({ error: 'Email or password is invalid.' });

  if (!targetUser.confirmed) return res.status(401).send({ error: 'Please confirm your email to log in.' });

  const refreshToken = nanoid(64);
  const refreshTokenExpiration = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_TTL));

  const session = new Session({
    refreshToken,
    player: targetUser._id,
    expires: refreshTokenExpiration,
    userAgent: req.get('User-Agent'),
  });

  await session.save();

  const token = jwt.sign({ _id: targetUser._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_TTL,
  });

  res.send({
    token,
    refreshToken,
  });
});

router.post('/refresh', async (req, res) => {
  const session = await Session.findOne({ refreshToken: req.body.refreshToken });
  if (!session) return res.status(400).json({ error: 'Invalid refresh token' });

  if (session.expires < new Date()) {
    session.remove();
    return res.status(400).json({ error: 'Refresh token expired' });
  }

  const refreshToken = nanoid(64);
  const refreshTokenExpiration = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_TTL));

  session.refreshToken = refreshToken;
  session.expires = refreshTokenExpiration;
  session.userAgent = req.get('User-Agent');

  await session.save();

  const token = jwt.sign({ _id: session.player }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_TTL,
  });

  res.send({
    token,
    refreshToken,
  });
});

router.post('/logout', async (req, res) => {
  const session = await Session.findOne({ refreshToken: req.body.refreshToken });
  if (!session) return res.status(400).json({ error: 'Invalid refresh token' });

  await Session.deleteOne(session._id);

  res.send('Successfully logged out.');
});

router.get('/confirmation/:token', async (req, res) => {
  const { _id, email } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
  const targetUser = await Player.findById(_id);

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
  const targetUser = await Player.findOne({ email: req.body.email });

  if (!targetUser) {
    return res.status(400).json({ error: 'Could not find user with that email address.' });
  }

  const token = jwt.sign({ _id: targetUser._id }, process.env.EMAIL_SECRET, { expiresIn: '2 days' });

  await sendMail(targetUser.email, token, targetUser.name, Templates.resetPassword);

  return res.json(true);
});

router.patch('/reset', async (req, res) => {
  const { _id } = jwt.verify(req.body.token, process.env.EMAIL_SECRET);

  const targetUser = await Player.findById(_id);
  if (!targetUser) {
    return res.status(401).json({ error: 'Player not found' });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  targetUser.password = hashedPassword;
  await targetUser.save();
  return res.json(true);
});

module.exports = router;
