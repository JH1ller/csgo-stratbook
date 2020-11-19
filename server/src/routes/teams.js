const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const Player = require('../models/player');
const crypto = require('crypto');
const { getTeam } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');
const { teamValidation } = require('./utils/validation');
const { uploadMiddleware, processImage } = require('./utils/fileUpload');

router.get('/', verifyAuth, async (req, res) => {
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
    const sanitizedPlayers = players.map((player) => ({
      _id: player._id,
      name: player.name,
      role: player.role,
      createdAt: player.createdAt,
      avatar: player.avatar,
      team: player.team,
      isOnline: player.isOnline,
      lastOnline: player.lastOnline,
    }));
    res.json(sanitizedPlayers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Create One
router.post('/', verifyAuth, uploadMiddleware, async (req, res) => {
  const { error } = teamValidation(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const teamExists = await Team.findOne({ name: req.body.name });

  if (teamExists) return res.status(400).send({ error: 'Team name already exists' });

  const team = new Team({
    name: req.body.name,
    avatar: req.body.avatar,
    createdBy: res.player._id,
    manager: res.player._id,
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
    const updatedPlayer = await res.player.save();

    res.status(201).json({
      _id: updatedPlayer._id,
      name: updatedPlayer.name,
      role: updatedPlayer.role,
      createdAt: updatedPlayer.createdAt,
      avatar: updatedPlayer.avatar,
      team: updatedPlayer.team,
      isOnline: updatedPlayer.isOnline,
      lastOnline: updatedPlayer.lastOnline,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Update One
router.patch('/', verifyAuth, getTeam, async (req, res) => {
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
router.delete('/', verifyAuth, async (req, res) => {
  try {
    const team = await Team.findById(res.player.team);
    if (team.manager === res.player._id) {
      await res.team.delete();
      const members = await Player.find({ team: res.team._id });
      const memberPromises = members.map(async (member) => {
        member.team = undefined;
        return await member.save();
      });
      await Promise.all(memberPromises);
      res.json({ message: 'Deleted team successfully' });
    } else {
      res.status(403).json({ error: 'This action requires higher privileges.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Join team
router.patch('/join', verifyAuth, async (req, res) => {
  const team = await Team.findOne({ code: req.body.code });

  if (!team) {
    return res.status(400).json({ error: 'Wrong join code' });
  }

  try {
    res.player.team = team._id;
    const updatedPlayer = await res.player.save();
    return res.json({
      _id: updatedPlayer._id,
      name: updatedPlayer.name,
      role: updatedPlayer.role,
      createdAt: updatedPlayer.createdAt,
      avatar: updatedPlayer.avatar,
      team: updatedPlayer.team,
      isOnline: updatedPlayer.isOnline,
      lastOnline: updatedPlayer.lastOnline,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// * Leave team
router.patch('/leave', verifyAuth, async (req, res) => {
  const team = await Team.findById(res.player.team);
  const members = await Player.find({ team: team._id });

  if (members.length > 1) {

    if (team.manager.equals(res.player._id)) {
      return res.status(400).json({ error: 'You need to transfer leadership first.' });
    }
    
    let code;

    while (true) {
      code = crypto.randomBytes(3).toString('hex');
      if (!(await Team.findOne({ code }))) break;
    }

    team.code = code;

    await team.save();
  } else {
    await team.delete();
  }

  res.player.team = undefined;

  try {
    const updatedPlayer = await res.player.save();
    return res.json({
      _id: updatedPlayer._id,
      name: updatedPlayer.name,
      role: updatedPlayer.role,
      createdAt: updatedPlayer.createdAt,
      avatar: updatedPlayer.avatar,
      team: updatedPlayer.team,
      isOnline: updatedPlayer.isOnline,
      lastOnline: updatedPlayer.lastOnline,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// * Transfer leader
router.patch('/transfer', verifyAuth, async (req, res) => {
  const team = await Team.findById(res.player.team);
  
  if (!res.player._id.equals(team.manager)) {
    return res.status(403).json({ error: 'Only a team manager can transfer leadership.' });
  }

  if (team.manager.equals(req.body._id)) {
    return res.status(400).json({ error: 'Selected player is already team manager.' });
  }

  team.manager = req.body._id;
  
  try {
    const updatedTeam = await team.save();
    return res.json(updatedTeam);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// * Kick member
router.patch('/kick', verifyAuth, async (req, res) => {
  const team = await Team.findById(res.player.team);
  const target = await Player.findById(req.body._id);

  if (!res.player._id.equals(team.manager)) {
    return res.status(400).json({ error: 'Only a team manager can kick players.' });
  }

  if (!target.team.equals(team._id)) {
    return res.status(400).json({ error: 'Cannot kick player from another team.' });
  }

  if (target._id.equals(team.manager)) {
    return res.status(400).json({ error: 'Cannot kick the team manager.' });
  }
    
  //* move generate new code logic into util function
  let code;

  while (true) {
    code = crypto.randomBytes(3).toString('hex');
    if (!(await Team.findOne({ code }))) break;
  }

  team.code = code;

  target.team = undefined;
  
  try {
    await target.save();
    await team.save();
    return res.json({ success: `Player ${target.name} was kicked from the team.`});
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ! Delete All | admin
router.delete('/deleteAll', verifyAuth, async (req, res) => {
  try {
    if (res.player.isAdmin) {
      await Team.deleteMany({});
      await Team.collection.dropIndexes();
      res.json({ message: 'Deleted all teams' });
    } else {
      res.status(403).json({ error: 'This action requires higher privileges.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
