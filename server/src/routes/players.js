const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const Team = require('../models/team');
const { getPlayer } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');

// ! Get all | make admin later
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Get One
router.get('/:player_id', verifyAuth, getPlayer, (req, res) => {
  res.json({
    _id: res.player._id,
    name: res.player.name,
    email: res.player.email,
    role: res.player.role,
    avatar: res.player.avatar,
    team: res.player.team,
    date: res.player.date,
  });
});

// * Update One
router.patch('/update', verifyAuth, getPlayer, async (req, res) => {
  if (req.body.name) {
    res.player.name = req.body.name;
  }
  if (req.body.role) {
    res.player.role = req.body.role;
  }
  if (req.body.avatar) {
    res.player.avatar = req.body.avatar;
  }
  if (req.body.team) {
    res.player.team = req.body.team;
  }
  if (req.body.team === '#null') {
    res.player.team = undefined;
  }
  try {
    const updatedPlayer = await res.player.save();
    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Delete One
router.delete('/:player_id/delete', verifyAuth, getPlayer, async (req, res) => {
  try {
    await res.player.remove();
    res.json({ message: 'Deleted player successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Get Team Info
router.get('/:player_id/team', verifyAuth, getPlayer, async (req, res) => {
  if (!res.player.team) {
    return res.status(400).json({ message: "Player doesn't have a team" });
  }
  const team = await Team.findById(res.player.team);

  if (team) {
    return res.json(team);
  } else {
    res.status(400).json({ message: 'Team not found.' });
  }
});

// ! Delete All | admin
router.delete('/deleteAll', async (req, res) => {
  try {
    await Player.deleteMany({});
    await Player.collection.dropIndexes();
    res.json({ message: 'Deleted all players' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
