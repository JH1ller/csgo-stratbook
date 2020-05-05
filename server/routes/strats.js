const express = require('express');
const router = express.Router();
const Strat = require('../models/strat');
const { getStrat } = require('./utils/utils');

// * Get all
router.get('/', async (req, res) => {
    try {
        const strats = await Strat.find();
        res.json(strats)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})

// * Get One
router.get('/:strat_id', getStrat, (req, res) => {
    res.json(res.strat)
})

// * Create One
router.post('/create', async (req, res) => {
    const strat = new Strat({
        name: req.body.name,
        active: req.body.active,
        strats: req.body.strats,
        image: req.body.image
    });
    try {
        const newStrat = await strat.save();
        res.status(201).json(newStrat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// * Update One
router.patch('/:strat_id/update', getStrat, async (req, res) => {
    if (req.body.name) {
        res.strat.name = req.body.name;
    }
    if (req.body.active) {
        res.strat.active = req.body.active;
    }
    if (req.body.strats) {
        res.strat.strats = req.body.strats;
    }
    if (req.body.image) {
        res.strat.image = req.body.image;
    }
    try {
        const updatedStrat = await res.strat.save();
        res.json(updatedStrat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// * Delete One
router.delete('/:strat_id/delete', getStrat, async (req, res) => {
    try {
        await res.strat.remove();
        res.json({ message: 'Deleted strat successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// * Delete All
router.delete('/deleteAll', async (req, res) => {
    try {
        await Strat.deleteMany({});
        res.json({ message: 'Deleted all strats' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
})

module.exports = router;