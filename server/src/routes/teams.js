const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const { getTeam } = require('./utils/getters');
const { verifyAuth } = require('./utils/verifyToken');
const { teamValidation } = require('./utils/validation');
const { uploadMiddleware, processImage } = require('./utils/fileUpload');

// ! Get all | make admin later
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:team_id', verifyAuth, getTeam, (req, res) => {
  res.json(res.team);
});

// * Create One
router.post('/create', verifyAuth, uploadMiddleware, async (req, res) => {
  const { error } = teamValidation(req.body);
  if (error) {
    return res.status(400).send({ error: error.details[0].message });
  }

  const teamExists = await Team.findOne({ name: req.body.name });

  if (teamExists)
    return res.status(400).send({ error: 'Team name already exists' });

  const team = new Team({
    name: req.body.name,
    password: req.body.password,
    avatar: req.body.avatar,
    createdBy: req.user._id,
  });

  if (req.file) {
    team.avatar = req.file.filename;
    await processImage(req.file);
  }

  try {
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// * Update One
router.patch('/update', verifyAuth, getTeam, async (req, res) => {
  if (req.body.name) {
    res.team.name = req.body.name;
  }
  if (req.body.password) {
    res.team.password = req.body.password;
  }
  // TODO: add "edit avatar"
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
