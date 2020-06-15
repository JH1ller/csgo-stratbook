const express = require('express');
const router = express.Router();
const Strat = require('../models/strat');
const Player = require('../models/player');
const { getStrat } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');

// * Get all
router.get('/', verifyAuth, async (req, res) => {
  const player = await Player.findById(req.user._id);

  if (!player.team) {
    return res
      .status(400)
      .json({ error: "Authenticated user doesn't have a team" });
  }
  try {
    const strats = req.query.map
      ? await Strat.find({ map: req.query.map, team: player.team })
      : await Strat.find({ team: player.team });

    res.json(strats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Get One
router.get('/:strat_id', getStrat, (req, res) => {
  res.json(res.strat);
});

// * Create One
router.post('/create', verifyAuth, async (req, res) => {
  const player = await Player.findById(req.user._id);

  if (!player.team) {
    return res
      .status(400)
      .json({ error: "Authenticated user doesn't have a team" });
  }

  const strat = new Strat({
    name: req.body.name,
    type: req.body.type,
    map: req.body.map,
    side: req.body.side,
    active: req.body.active,
    videoLink: req.body.videoLink,
    note: req.body.note,
    team: player.team,
    createdBy: player._id,
    createdAt: Date.now(),
  });
  try {
    const newStrat = await strat.save();
    res.status(201).json(newStrat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Update One
router.patch('/:strat_id/update', getStrat, async (req, res) => {
  let modified = false;
  if (req.body.name !== null && req.body.name !== undefined) {
    res.strat.name = req.body.name;
    modified = true;
  }
  if (req.body.type !== null && req.body.type !== undefined) {
    res.strat.type = req.body.type;
    modified = true;
  }
  if (req.body.map !== null && req.body.map !== undefined) {
    res.strat.map = req.body.map;
    modified = true;
  }
  if (req.body.side !== null && req.body.side !== undefined) {
    res.strat.side = req.body.side;
    modified = true;
  }
  if (req.body.active !== null && req.body.active !== undefined) {
    res.strat.active = req.body.active;
    modified = true;
  }
  if (req.body.videoLink !== null && req.body.videoLink !== undefined) {
    res.strat.videoLink = req.body.videoLink;
    modified = true;
  }
  if (req.body.note !== null && req.body.note !== undefined) {
    res.strat.note = req.body.note;
    modified = true;
  }
  if (req.body.createdBy !== null && req.body.createdBy !== undefined) {
    res.strat.createdBy = req.body.createdBy;
    modified = true;
  }
  if (modified) {
    res.strat.modifiedAt = Date.now();
  }
  try {
    const updatedStrat = await res.strat.save();
    res.json(updatedStrat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Delete One
router.delete('/:strat_id/delete', getStrat, async (req, res) => {
  try {
    await res.strat.remove();
    res.json({ message: 'Deleted strat successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Delete All
router.delete('/deleteAll', async (req, res) => {
  try {
    await Strat.deleteMany({});
    await Strat.collection.dropIndexes();
    res.json({ message: 'Deleted all strats' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
