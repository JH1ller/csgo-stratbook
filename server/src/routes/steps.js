const express = require('express');
const router = express.Router();
const Step = require('../models/step');
const { getStep } = require('./utils/getters');

// * Get all
router.get('/', async (req, res) => {

    try {
        const steps = req.query.strat
            ? await Step.find({ strat: req.query.strat })
            : await Step.find();

        res.json(steps)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})

// * Get One
router.get('/:step_id', getStep, (req, res) => {
    res.json(res.step)
})

// * Create One
router.post('/create', async (req, res) => {
    const step = new Step({
        strat: req.body.strat,
        player: req.body.player,
        grenades: req.body.grenades,
        description: req.body.description,
        note: req.body.note,
    });
    try {
        const newStep = await step.save();
        res.status(201).json(newStep);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// * Update One
router.patch('/:step_id/update', getStep, async (req, res) => {
    if (req.body.strat) {
        res.step.strat = req.body.strat;
    }
    if (req.body.player) {
        res.step.player = req.body.player;
    }
    if (req.body.grenades) {
        res.step.grenades = req.body.grenades;
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
        res.status(400).json({ message: error.message });
    }
})

// * Delete One
router.delete('/:step_id/delete', getStep, async (req, res) => {
    try {
        await res.step.remove();
        res.json({ message: 'Deleted step successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// * Delete All
router.delete('/deleteAll', async (req, res) => {
    try {
        await Step.deleteMany({});
        await Step.collection.dropIndexes();
        res.json({ message: 'Deleted all steps' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
})

module.exports = router;