const express = require('express');
const router = express.Router();
const Map = require('../models/map');
const Strat = require('../models/strat');
const { getMap, getStrat } = require('./utils/utils');

// * Get all
router.get('/', async (req, res) => {
    try {
        const maps = await Map.find();
        res.json(maps)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})

// * Get One
router.get('/:map_id', getMap, (req, res) => {
    res.json(res.map)
})

// * Add strat
router.post('/:map_id/add', getMap, async (req, res) => {
    const strat = new Strat({
        name: req.body.name,
        type: req.body.type,
        side: req.body.side,
        active: req.body.active,
        videoLink: req.body.videoLink,
        note: req.body.note,
        createdBy: req.body.createdBy,
        createdAt: Date.now(),
        steps: req.body.steps
    });

    res.map.strats.push(strat._id);

    try {
        const newStrat = await strat.save();
        await res.map.save();
        res.status(201).json(newStrat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// * Remove strat
router.delete('/:map_id/delete/:strat_id', [getMap, getStrat], async (req, res) => {
    try {
        await res.strat.remove();
        await res.map.strats.pull(res.strat._id);
        await res.map.save();
        res.json({ message: 'Deleted strat successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// * Create One
router.post('/create', async (req, res) => {
    const map = new Map({
        name: req.body.name,
        active: req.body.active,
        image: req.body.image
    });
    try {
        const newMap = await map.save();
        res.status(201).json(newMap);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// * Update One
router.patch('/:map_id/update', getMap, async (req, res) => {
    if (req.body.name) {
        res.map.name = req.body.name;
    }
    if (req.body.active) {
        res.map.active = req.body.active;
    }
    if (req.body.image) {
        res.map.image = req.body.image;
    }
    try {
        const updatedMap = await res.map.save();
        res.json(updatedMap);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// * Delete One
router.delete('/:map_id/delete', getMap, async (req, res) => {
    try {
        await res.map.remove();
        res.json({ message: 'Deleted map successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// * Delete All
router.delete('/deleteAll', async (req, res) => {
    try {
        await Map.deleteMany({});
        res.json({ message: 'Deleted all maps' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
})

module.exports = router;