const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Strat = require('../../../models/strat');
const Player = require('../../../models/player');
const { uploadSingle, processImage, deleteFile } = require('../../utils/fileUpload');
const { verifyAuth } = require('../../utils/verifyToken');
const { sendMail, Templates } = require('../../utils/mailService');
const { profileUpdateValidation } = require('../../utils/validation');

// * Get User Profile
router.get('/', verifyAuth, (req, res) => {
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
  } = res.player;

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
  const { error } = profileUpdateValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    res.player.password = hashedPassword;
  }

  if (req.file) {
    const fileName = await processImage(req.file, 200, 200);
    if (res.player.avatar) {
      await deleteFile(res.player.avatar);
    }
    res.player.avatar = fileName;
  }

  if (req.body.name && req.query.updateStrats === 'true') {
    const strats = await Strat.find({ team: res.player.team });
    const promises = strats.map(async (strat) => {
      strat.content = strat.content.replace(res.player.name, req.body.name);
      await strat.save();
    });
    await Promise.all(promises);
  }

  if (req.body.name) {
    res.player.name = req.body.name;
  }

  if (req.body.email) {
    const emailExists = await Player.findOne({ email: req.body.email });

    if (emailExists) return res.status(400).json({ error: 'Email already exists.' });

    const token = jwt.sign({ _id: res.player._id, email: req.body.email }, process.env.EMAIL_SECRET);
    await sendMail(req.body.email, token, res.player.name, Templates.verifyChange);
  }

  if (req.body.completedTutorial) {
    res.player.completedTutorial = JSON.parse(req.body.completedTutorial);
  }

  const updatedPlayer = await res.player.save();

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
  } = updatedPlayer;

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

module.exports = router;
