const express = require('express');
const router = express.Router();
const Map = require('../models/map');
const Strat = require('../models/strat');
const { getMap, getStrat } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');

// * Get all
router.get('/', verifyAuth, async (req, res) => {
  try {
    const maps = await Map.find();
    res.json(maps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Create One
router.post('/', verifyAuth, async (req, res) => {
  const map = new Map({
    name: req.body.name,
    active: req.body.active,
    image: req.body.image,
  });
  try {
    const newMap = await map.save();
    res.status(201).json(newMap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Update One
router.patch('/', verifyAuth, getMap, async (req, res) => {
  if (req.body.name != null) {
    res.map.name = req.body.name;
  }
  if (req.body.active != null) {
    res.map.active = req.body.active;
  }
  if (req.body.image != null) {
    res.map.image = req.body.image;
  }
  try {
    const updatedMap = await res.map.save();
    res.json(updatedMap);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// * Delete One
router.delete('/:map_id', verifyAuth, getMap, async (req, res) => {
  try {
    await res.map.delete();
    res.json({ message: 'Deleted map successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// * Delete All
router.delete('/deleteAll', verifyAuth, async (req, res) => {
  // TODO: maybe add dev env conditional aswell
  try {
    if (res.player.isAdmin) {
      await Map.deleteMany({});
      await Map.collection.dropIndexes();
      res.json({ message: 'Deleted all maps' });
    } else {
      res.status(403).json({ error: 'This action requires higher privileges.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
