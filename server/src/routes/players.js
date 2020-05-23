const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const { getPlayer } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');

// ! Get all | make admin later
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

// * Get One
router.get('/:player_id', getPlayer, (req, res) => {
  res.json({
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
  try {
    const updatedPlayer = await res.player.save();
    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * Delete One
router.delete('/:player_id/delete', verifyAuth, getPlayer, async (req, res) => {
  try {
    await res.player.remove();
    res.json({ message: 'Deleted player successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ! Delete All | admin
router.delete('/deleteAll', async (req, res) => {
  try {
    await Player.deleteMany({});
    await Player.collection.dropIndexes();
    res.json({ message: 'Deleted all players' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
