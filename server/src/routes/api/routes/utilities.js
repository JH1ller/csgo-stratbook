const express = require('express');
const router = express.Router();
const Utility = require('../../../models/utility');
const { getUtility } = require('../../utils/getters');
const { verifyAuth } = require('../../utils/verifyToken');
const { uploadMultiple, uploadFile, deleteFile } = require('../../utils/fileUpload');

router.get('/', verifyAuth, async (req, res) => {
  if (!res.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  const utilities = req.query.map
    ? await Utility.find({ map: req.query.map, team: res.player.team })
    : await Utility.find({ team: res.player.team });

  res.json(utilities);
});

// * Create One
router.post('/', verifyAuth, uploadMultiple('images'), async (req, res) => {
  if (!res.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }

  const utility = new Utility({
    name: req.body.name,
    type: req.body.type,
    map: req.body.map,
    side: req.body.side,
    mouseButton: req.body.mouseButton,
    crouch: JSON.parse(req.body.crouch),
    movement: req.body.movement,
    videoLink: req.body.videoLink,
    description: req.body.description,
    team: res.player.team,
    createdBy: res.player._id,
    createdAt: Date.now(),
  });

  if (req.files) {
    utility.images.push(...req.files.map((img) => img.filename));
    await Promise.all(
      req.files.map(async (file) => {
        await uploadFile(file.path, file.filename);
      })
    );
  }
  const newUtility = await utility.save();
  res.status(201).json(newUtility);
});

// * Update One
router.patch('/', verifyAuth, uploadMultiple('images'), getUtility, async (req, res) => {
  if (!res.player.team.equals(res.utility.team)) {
    return res.status(400).json({ error: 'Cannot update a utility of another team.' });
  }
  const updatableFields = [
    'name',
    'map',
    'side',
    'type',
    'mouseButton',
    'crouch',
    'movement',
    'description',
    'shared',
    'videoLink',
  ];
  Object.entries(req.body).forEach(([key, value]) => {
    // check for undefined / null, but accept empty string ''
    if (value != null && updatableFields.includes(key)) {
      res.utility[key] = value;
    }
  });

  if (req.files) {
    res.utility.images.push(...req.files.map((img) => img.filename));
    await Promise.all(
      req.files.map(async (file) => {
        await uploadFile(file.path, file.filename);
      })
    );
  }

  if (req.body.delete) {
    const imagesToDelete = JSON.parse(req.body.delete);
    res.utility.images = res.utility.images.filter((image) => !imagesToDelete.includes(image));
    await Promise.all(
      imagesToDelete.map(async (image) => {
        await deleteFile(image);
      })
    );
  }

  const updatedUtility = await res.utility.save();
  res.json(updatedUtility);
});

// * Delete One
router.delete('/:utility_id', verifyAuth, getUtility, async (_req, res) => {
  if (!res.player.team.equals(res.utility.team)) {
    return res.status(400).json({ error: 'Cannot delete a utility of another team.' });
  }
  await res.utility.delete();
  res.json({ message: 'Deleted utility successfully' });
});

module.exports = router;
