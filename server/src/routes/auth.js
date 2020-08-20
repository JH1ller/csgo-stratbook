const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Player = require('../models/player');
const { registerValidation, loginValidation } = require('./utils/validation');
const { sendMail } = require('./utils/mailService');
const { uploadMiddleware, processImage } = require('./utils/fileUpload');

/**
 * * Routes
 */

router.post('/register', uploadMiddleware, async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const emailExists = await Player.findOne({ email: req.body.email });

  if (emailExists) return res.status(400).json({ error: 'Email already exists' });

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

  try {
    const token = jwt.sign({ _id: user._id }, process.env.EMAIL_SECRET);
    await sendMail(user.email, token, user.name);
    await user.save();
    res.json({ _id: user._id, email: user.email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.post('/login', async (req, res) => {
  const targetUser = await Player.findOne({ email: req.body.email });

  if (!targetUser) return res.status(400).json({ error: 'Email or password is invalid.' });

  const validPassword = await bcrypt.compare(req.body.password, targetUser.password);

  if (!validPassword) return res.status(400).json({ error: 'Email or password is invalid.' });

  if (!targetUser.confirmed) return res.status(401).send({ error: 'Please confirm your email to log in.' });

  const token = jwt.sign({ _id: targetUser._id }, process.env.TOKEN_SECRET, {
    expiresIn: '30d',
  });
  res.header('Authorization', token).send(token);
});

router.get('/confirmation/:token', async (req, res) => {
  try {
    const { _id } = jwt.verify(req.params.token, process.env.EMAIL_SECRET);
    const targetUser = await Player.findById(_id);
    targetUser.confirmed = true;
    await targetUser.save();
    return res.redirect('/success');
  } catch (error) {
    res.status(400).json({ error: error });
    return res.redirect('/error');
  }
});

module.exports = router;
