const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const { getPlayer } = require('./utils/utils');

// * Get all
router.get('/', async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players)
    } catch (error) {
        res.status(500).json({ message: err.message })
    }
})

// * Get One
router.get('/:player_id', getPlayer, (req, res) => {
    res.json(res.player)
})

// * Create One
router.post('/create', async (req, res) => {
    const player = new Player({
        name: req.body.name,
        role: req.body.role,
        avatar: req.body.avatar
    });
    try {
        const newPlayer = await player.save();
        res.status(201).json(newPlayer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// * Update One
router.patch('/:player_id/update', getPlayer, async (req, res) => {
    if (req.body.name) {
        res.player.name = req.body.name;
    }
    if (req.body.role) {
        res.player.role = req.body.role;
    }
    if (req.body.avatar) {
        res.player.avatar = req.body.avatar;
    }
    try {
        const updatedPlayer = await res.player.save();
        res.json(updatedPlayer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// * Delete One
router.delete('/:player_id/delete', getPlayer, async (req, res) => {
    try {
        await res.player.remove();
        res.json({ message: 'Deleted player successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// * Delete All
router.delete('/deleteAll', async (req, res) => {
    try {
        await Player.deleteMany({});
        res.json({ message: 'Deleted all players' });
    } catch (error) {
        res.status(500).json({ message: error });
    }
})



module.exports = router;