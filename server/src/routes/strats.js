const express = require('express');
const router = express.Router();
const Strat = require('../models/strat');
const Player = require('../models/player');
const { getStrat, getPlayer } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');

router.get('/', verifyAuth, async (req, res) => {
  if (!res.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  try {
    const strats = req.query.map
      ? await Strat.find({ map: req.query.map, team: res.player.team })
      : await Strat.find({ team: res.player.team });

    res.json(strats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Create One
router.post('/', verifyAuth, async (req, res) => {
  if (!res.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }

  const strat = new Strat({
    name: req.body.name,
    type: req.body.type,
    map: req.body.map,
    side: req.body.side,
    active: req.body.active,
    videoLink: req.body.videoLink,
    note: req.body.note,
    team: res.player.team,
    createdBy: res.player._id,
    createdAt: Date.now(),
  });

  try {
    const newStrat = await strat.save();
    res.status(201).json(newStrat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Update One
router.patch('/', getStrat, async (req, res) => {
  if (req.body.name != null) {
    res.strat.name = req.body.name;
  }
  if (req.body.type != null) {
    res.strat.type = req.body.type;
  }
  if (req.body.map != null) {
    res.strat.map = req.body.map;
  }
  if (req.body.side != null) {
    res.strat.side = req.body.side;
  }
  if (req.body.active != null) {
    res.strat.active = req.body.active;
  }
  if (req.body.videoLink != null) {
    res.strat.videoLink = req.body.videoLink;
  }
  if (req.body.note != null) {
    res.strat.note = req.body.note;
  }
  if (req.body.content != null) {
    res.strat.content = req.body.content;
  }
  try {
    const updatedStrat = await res.strat.save();
    res.json(updatedStrat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Delete One
router.delete('/:strat_id', getStrat, async (req, res) => {
  try {
    await res.strat.delete();
    res.json({ message: 'Deleted strat successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Delete All
router.delete('/deleteAll', async (req, res) => {
  try {
    if (res.player.isAdmin) {
      await Strat.deleteMany({});
      await Strat.collection.dropIndexes();
      res.json({ message: 'Deleted all strats' });
    } else {
      res.status(403).json({ error: 'This action requires higher privileges.' });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
