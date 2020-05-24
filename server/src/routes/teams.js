const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const { getTeam } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');

// ! Get all | make admin later
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

// ! Get One | Make admin later
router.get('/:team_id', getTeam, (req, res) => {
  res.json(res.team);
});

// * Update One
router.patch('/update', verifyAuth, getTeam, async (req, res) => {
  if (req.body.name) {
    res.team.name = req.body.name;
  }
  if (req.body.role) {
    res.team.role = req.body.role;
  }
  if (req.body.avatar) {
    res.team.avatar = req.body.avatar;
  }
  try {
    const updatedTeam = await res.team.save();
    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * Delete One
router.delete('/:team_id/delete', verifyAuth, getTeam, async (req, res) => {
  try {
    await res.team.remove();
    res.json({ message: 'Deleted team successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ! Delete All | admin
router.delete('/deleteAll', async (req, res) => {
  try {
    await Team.deleteMany({});
    await Team.collection.dropIndexes();
    res.json({ message: 'Deleted all teams' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
