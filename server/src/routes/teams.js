const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const Player = require('../models/player');
const crypto = require('crypto');
const { getTeam, getPlayer } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');
const { teamValidation } = require('./utils/validation');
const { uploadMiddleware, processImage } = require('./utils/fileUpload');

router.get('/', verifyAuth, getPlayer, async (req, res) => {
  try {
    if (!res.player.team) {
      return res.status(400).json({ message: "Player doesn't have a team" });
    }
    const team = await Team.findById(res.player.team);
    if (team) {
      return res.json(team);
    } else {
      res.status(400).json({ message: 'Team not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/players', verifyAuth, async (req, res) => {
  try {
    const players = await Player.find({ team: res.player.team });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Create One
router.post('/create', verifyAuth, getPlayer, uploadMiddleware, async (req, res) => {
  const { error } = teamValidation(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const teamExists = await Team.findOne({ name: req.body.name });

  if (teamExists) return res.status(400).send({ error: 'Team name already exists' });

  const team = new Team({
    name: req.body.name,
    avatar: req.body.avatar,
    createdBy: req.user._id,
    manager: req.user._id,
    website: req.body.website,
    server: {
      ip: req.body.serverIp,
      password: req.body.serverPw,
    },
  });

  let code;

  while (true) {
    code = crypto.randomBytes(3).toString('hex');
    if (!(await Team.findOne({ code }))) break;
  }

  team.code = code;

  if (req.file) {
    team.avatar = req.file.filename;
    await processImage(req.file);
  }

  try {
    const newTeam = await team.save();
    res.player.team = newTeam._id;
    await res.player.save();

    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Update One
router.patch('/update', verifyAuth, getTeam, async (req, res) => {
  if (req.body.name != null) {
    res.team.name = req.body.name;
  }
  if (req.body.code != null) {
    res.team.code = req.body.code;
  }
  if (req.body.website != null) {
    res.team.website = req.body.website;
  }
  if (req.body.server != null) {
    res.team.server = req.body.server;
  }
  if (req.body.manager != null) {
    res.team.manager = req.body.manager;
  }
  // TODO: add "edit avatar"
  try {
    const updatedTeam = await res.team.save();
    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Delete One
router.delete('/:team_id/delete', verifyAuth, getTeam, async (req, res) => {
  try {
    await res.team.remove();
    res.json({ message: 'Deleted team successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Join team
router.patch('/join', verifyAuth, async (req, res) => {
  const player = await Player.findById(req.user._id);
  const team = await Team.findOne({ code: req.body.code });

  if (!team) {
    return res.status(400).json({ error: 'Wrong join code' });
  }

  try {
    player.team = team._id;
    const updatedPlayer = await player.save();
    return res.json(updatedPlayer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// * Leave team
router.patch('/leave', verifyAuth, getPlayer, async (req, res) => {
  const team = await Team.findById(res.player.team);

  let code;

  while (true) {
    code = crypto.randomBytes(3).toString('hex');
    if (!(await Team.findOne({ code }))) break;
  }

  team.code = code;

  await team.save();

  player.team = undefined;

  try {
    const updatedPlayer = await player.save();
    return res.json(updatedPlayer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! Delete All | admin
router.delete('/deleteAll', async (req, res) => {
  try {
    await Team.deleteMany({});
    await Team.collection.dropIndexes();
    res.json({ message: 'Deleted all teams' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
