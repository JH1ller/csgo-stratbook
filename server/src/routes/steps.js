const express = require('express');
const router = express.Router();
const { stepSchema: Step, equipmentSchema: Equip } = require('../models/step');
const { getStep } = require('./utils/getters');

// * Get all
router.get('/', async (req, res) => {
  try {
    const steps = req.query.strat
      ? await Step.find({ strat: req.query.strat })
      : await Step.find();

    res.json(steps);
  } catch (error) {
    res.status(500).json({ error: err.message });
  }
});

// * Get One
router.get('/:step_id', getStep, (req, res) => {
  res.json(res.step);
});

// * Create One
router.post('/create', async (req, res) => {
  const equip = new Equip(req.body.equipment);
  const step = new Step({
    strat: req.body.strat,
    player: req.body.player,
    equipment: equip,
    description: req.body.description,
    note: req.body.note,
  });
  try {
    const newStep = await step.save();
    res.status(201).json(newStep);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Update One
router.patch('/:step_id/update', getStep, async (req, res) => {
  if (req.body.strat) {
    res.step.strat = req.body.strat;
  }
  if (req.body.player) {
    res.step.player = req.body.player;
  }
  if (req.body.equipment) {
    res.step.equipment = req.body.equipment;
  }
  if (req.body.description) {
    res.step.description = req.body.description;
  }
  if (req.body.note) {
    res.step.note = req.body.note;
  }
  try {
    const updatedStep = await res.step.save();
    res.json(updatedStep);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Delete One
router.delete('/:step_id/delete', getStep, async (req, res) => {
  try {
    await res.step.remove();
    res.json({ message: 'Deleted step successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Delete All
router.delete('/deleteAll', async (req, res) => {
  try {
    await Step.deleteMany({});
    await Step.collection.dropIndexes();
    res.json({ message: 'Deleted all steps' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
