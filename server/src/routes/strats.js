const express = require('express');
const router = express.Router();
const Strat = require('../models/strat');
const { getStrat } = require('./utils/getters');

// * Get all
router.get('/', async (req, res) => {

    try {
        const strats = req.params.map
            ? await Strat.find({ map: req.params.map })
            : await Strat.find();

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
        type: req.body.type,
        map: req.body.map,
        side: req.body.side,
        active: req.body.active,
        videoLink: req.body.videoLink,
        note: req.body.note,
        createdBy: req.body.createdBy,
        createdAt: Date.now(),
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
    let modified = false;
    if (req.body.name) {
        res.strat.name = req.body.name;
        modified = true;
    }
    if (req.body.type) {
        res.strat.type = req.body.type;
        modified = true;
    }
    if (req.body.map) {
        res.strat.map = req.body.map;
        modified = true;
    }
    if (req.body.side) {
        res.strat.side = req.body.side;
        modified = true;
    }
    if (req.body.active) {
        res.strat.active = req.body.active;
        modified = true;
    }
    if (req.body.videoLink) {
        res.strat.videoLink = req.body.videoLink;
        modified = true;
    }
    if (req.body.note) {
        res.strat.note = req.body.note;
        modified = true;
    }
    if (req.body.createdBy) {
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
        await Strat.collection.dropIndexes();
        res.json({ message: 'Deleted all strats' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
})

module.exports = router;