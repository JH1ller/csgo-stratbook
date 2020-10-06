const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const { getPlayer } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');

// * Get One
router.get('/:player_id', verifyAuth, getPlayer, (req, res) => {
  const { _id, name, role, avatar, team, createdAt } = res.player;
  res.json({
    _id,
    name,
    role,
    avatar,
    team,
    createdAt,
  });
});

// * Update One
router.patch('/', verifyAuth, async (req, res) => {
  if (req.body.name != null) {
    res.player.name = req.body.name;
  }
  if (req.body.role != null) {
    res.player.role = req.body.role;
  }
  if (req.body.avatar != null) {
    res.player.avatar = req.body.avatar;
  }
  if (req.body.team != null) {
    res.player.team = req.body.team;
  }
  try {
    const updatedPlayer = await res.player.save();
    res.json(updatedPlayer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Delete One
router.delete('/:player_id', verifyAuth, async (req, res) => {
  try {
    if (res.player.isAdmin) {
      await res.player.delete();
      res.json({ message: 'Deleted player successfully' });
    } else {
      res.status(403).json({ error: 'This action requires higher privileges.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/deleteAll', verifyAuth, async (req, res) => {
  try {
    if (res.player.isAdmin) {
      await Player.deleteMany({});
      await Player.collection.dropIndexes();
      res.json({ message: 'Deleted all players' });
    } else {
      res.status(403).json({ error: 'This action requires higher privileges.' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
