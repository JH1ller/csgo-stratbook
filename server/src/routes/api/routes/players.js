const express = require('express');
const router = express.Router();
const Player = require('../../../models/player');
const { getPlayer } = require('../../utils/getters');
const { verifyAuth } = require('../../utils/verifyToken');

// * Get One
router.get('/:player_id', verifyAuth, getPlayer, (req, res) => {
  const { _id, name, role, avatar, team, createdAt, isOnline, lastOnline } = res.player;
  res.json({
    _id,
    name,
    role,
    avatar,
    team,
    createdAt,
    isOnline,
    lastOnline,
  });
});

// * Update One
router.patch('/', verifyAuth, async (req, res) => {
  const updatableFields = ['name', 'avatar', 'team'];
  Object.entries(req.body).forEach(([key, value]) => {
    // check for undefined / null, but accept empty string ''
    if (value != null && updatableFields.includes(key)) res.strat[key] = value;
  });
  const updatedPlayer = await res.player.save();
  res.json(updatedPlayer);
});

// * Delete One
router.delete('/:player_id', verifyAuth, async (req, res) => {
  if (res.player.isAdmin) {
    await res.player.delete();
    res.json({ message: 'Deleted player successfully' });
  } else {
    res.status(403).json({ error: 'This action requires higher privileges.' });
  }
});

router.delete('/deleteAll', verifyAuth, async (req, res) => {
  if (res.player.isAdmin) {
    await Player.deleteMany({});
    await Player.collection.dropIndexes();
    res.json({ message: 'Deleted all players' });
  } else {
    res.status(403).json({ error: 'This action requires higher privileges.' });
  }
});

module.exports = router;
