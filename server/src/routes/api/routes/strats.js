const express = require('express');
const router = express.Router();
const Strat = require('../../../models/strat');
const { getStrat } = require('../..//utils/getters');
const { verifyAuth } = require('../../utils/verifyToken');

router.get('/', verifyAuth, async (req, res) => {
  if (!res.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  const strats = req.query.map
    ? await Strat.find({ map: req.query.map, team: res.player.team })
    : await Strat.find({ team: res.player.team });

  res.json(strats);
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

  const newStrat = await strat.save();
  res.status(201).json(newStrat);
});

// * Add shared
router.post('/share/:id', verifyAuth, async (req, res) => {
  if (!res.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }

  const strat = await Strat.findById(req.params.id);
  if (!strat || !strat.shared) {
    return res.status(400).json({ error: "Strat doesn't exist or hasn't been shared by owner." });
  }

  if (strat.team.equals(res.player.team)) {
    return res.status(400).json({ error: 'This strat already exists in your teams stratbook' });
  }

  const stratCopy = new Strat({
    team: res.player.team,
    name: strat.name,
    content: strat.content,
    note: strat.note,
    videoLink: strat.videoLink,
    side: strat.side,
    type: strat.type,
    map: strat.map,
    createdBy: res.player._id,
    createdAt: Date.now(),
  });

  await stratCopy.save();
  res.status(201).json(stratCopy);
});

// * Update One
router.patch('/', verifyAuth, getStrat, async (req, res) => {
  if (!res.player.team.equals(res.strat.team)) {
    return res.status(400).json({ error: 'Cannot update a strat of another team.' });
  }
  const updatableFields = ['name', 'map', 'side', 'type', 'active', 'videoLink', 'note', 'content', 'shared'];
  Object.entries(req.body).forEach(([key, value]) => {
    // check for undefined / null, but accept empty string ''
    if (value != null && updatableFields.includes(key)) res.strat[key] = value;
  });
  const updatedStrat = await res.strat.save();
  res.json(updatedStrat);
});

// * Delete One
router.delete('/:strat_id', verifyAuth, getStrat, async (req, res) => {
  if (!res.player.team.equals(res.strat.team)) {
    return res.status(400).json({ error: 'Cannot delete a strat of another team.' });
  }
  await res.strat.delete();
  res.json({ message: 'Deleted strat successfully' });
});

module.exports = router;
