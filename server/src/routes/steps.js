const express = require('express');
const router = express.Router();
const { stepSchema: Step, equipmentSchema: Equip } = require('../models/step');
const Strat = require('../models/strat');
const { getStep, getPlayer } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');

// * Get all
router.get('/', verifyAuth, async (req, res) => {
  try {
    const strat = await Strat.findById(req.query.strat);
    if (!strat.team.equals(res.player.team)) return res.status(403).json({ error: 'Unauthorized' });

    const steps = await Step.find({ strat: req.query.strat });
    res.json(steps);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

// * Create One
router.post('/create', verifyAuth, async (req, res) => {
  try {
    const strat = await Strat.findById(req.body.strat);
    if (!strat.team.equals(res.player.team)) return res.status(403).json({ error: 'Unauthorized' });

    const equip = new Equip(req.body.equipment);
    const step = new Step({
      strat: req.body.strat,
      createdBy: res.player._id,
      equipment: equip,
      description: req.body.description,
      note: req.body.note,
      createdAt: Date.now(),
      actor: req.body.actor,
    });

    const newStep = await step.save();
    res.status(201).json(newStep);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Update One
router.patch('/update', verifyAuth, getStep, async (req, res) => {
  const strat = await Strat.findById(res.step.strat);
  if (!strat.team.equals(res.player.team)) return res.status(403).json({ error: 'Unauthorized' });

  if (req.body.strat != null) {
    res.step.strat = req.body.strat;
  }
  if (req.body.equipment != null) {
    res.step.equipment = req.body.equipment;
  }
  if (req.body.description != null) {
    res.step.description = req.body.description;
  }
  if (req.body.note != null) {
    res.step.note = req.body.note;
  }
  if (req.body.actor != null) {
    res.step.actor = req.body.actor;
  }
  try {
    const updatedStep = await res.step.save();
    res.json(updatedStep);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Delete One
router.delete('/:step_id/delete', verifyAuth, getStep, async (req, res) => {
  try {
    const strat = await Strat.findById(res.step.strat);
    if (!strat.team.equals(res.player.team)) return res.status(403).json({ error: 'Unauthorized' });
    await res.step.remove();
    res.json({ message: 'Deleted step successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
