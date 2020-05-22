const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Player = require('../models/player');
const { registerValidation, loginValidation } = require('./utils/validation');
const { sendMail } = require('./utils/mailService');

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const emailExists = await Player.findOne({ email: req.body.email });

  if (emailExists) return res.status(400).send('Email already exists');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new Player({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const newUser = await user.save();

    const token = jwt.sign({ _id: newUser._id }, process.env.EMAIL_SECRET);

    sendMail(newUser.email, token);

    res.send({ user: user._id });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send({ error: error.details[0].message });

  const targetUser = await Player.findOne({ email: req.body.email });

  if (!targetUser)
    return res.status(400).send({ error: 'Email or password is wrong.' });

  const validPassword = await bcrypt.compare(
    req.body.password,
    targetUser.password
  );

  if (!validPassword)
    return res.status(400).send({ error: 'Email or password is wrong.' });

  if (!targetUser.confirmed)
    return res.status(400).send({ error: 'Email is not confirmed yet.' });

  const token = jwt.sign({ _id: targetUser._id }, process.env.TOKEN_SECRET);
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
    res.status(400).send({ error: error });
    return res.redirect('/error');
  }
});

module.exports = router;
