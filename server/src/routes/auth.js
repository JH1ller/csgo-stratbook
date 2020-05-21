const express = require('express');
const router = express.Router();
const Player = require('../models/player');

const Joi = require('@hapi/joi');

const schema = {
  name: Joi.string().alphanum().min(6).max(20).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/)
    .required(),
};

router.post('/register', async (req, res) => {
  const user = new Player({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

module.exports = router;
