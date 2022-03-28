import { Router } from 'express';
import { UtilityModel } from '@/models/utility';
import { getUtility } from '@/utils/getters';
import { verifyAuth } from '@/utils/verifyToken';
import { uploadMultiple, deleteFile, processImage } from '@/utils/fileUpload';
import { TypedServer } from '@/sockets/interfaces';

const router = Router();

router.get('/', verifyAuth, async (req, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  const utilities = req.query.map
    ? await UtilityModel.find({ map: req.query.map, team: res.locals.player.team })
    : await UtilityModel.find({ team: res.locals.player.team });

  res.json(utilities);
});

// * Create One
router.post('/', verifyAuth, uploadMultiple('images'), async (req, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }

  const utility = new UtilityModel({
    name: req.body.name,
    type: req.body.type,
    map: req.body.map,
    side: req.body.side,
    mouseButton: req.body.mouseButton,
    crouch: JSON.parse(req.body.crouch),
    jump: JSON.parse(req.body.jump),
    movement: req.body.movement,
    videoLink: req.body.videoLink,
    setpos: req.body.setpos,
    description: req.body.description,
    team: res.locals.player.team,
    createdBy: res.locals.player._id,
    createdAt: Date.now(),
  });

  if (req.files && Array.isArray(req.files)) {
    const fileNames = await Promise.all(
      req.files.map(async (file) => {
        return await processImage(file, 1920, 1080);
      })
    );
    utility.images.push(...fileNames);
  }
  const newUtility = await utility.save();
  res.status(201).json(newUtility);
  (req.app.get('io') as TypedServer)
    .to(newUtility.team.toString())
    .emit('created-utility', { utility: newUtility.toObject() });
});

// * Update One
router.patch('/', verifyAuth, uploadMultiple('images'), getUtility, async (req, res) => {
  if (!res.locals.player.team.equals(res.locals.utility.team)) {
    return res.status(400).json({ error: 'Cannot update a utility of another team.' });
  }
  const updatableFields = [
    'name',
    'map',
    'side',
    'type',
    'mouseButton',
    'crouch',
    'jump',
    'movement',
    'description',
    'shared',
    'videoLink',
    'setpos',
  ];
  Object.entries(req.body).forEach(([key, value]) => {
    // check for undefined / null, but accept empty string ''
    if (value != null && updatableFields.includes(key)) {
      res.locals.utility[key.toString()] = value;
    }
  });

  if (req.files && Array.isArray(req.files)) {
    const fileNames = await Promise.all(
      req.files.map(async (file) => {
        return await processImage(file, 1920, 1080);
      })
    );
    res.locals.utility.images.push(...fileNames);
  }

  if (req.body.delete) {
    const imagesToDelete = JSON.parse(req.body.delete);
    res.locals.utility.images = res.locals.utility.images.filter((image: string) => !imagesToDelete.includes(image));
    await Promise.all(
      imagesToDelete.map(async (image: string) => {
        await deleteFile(image);
      })
    );
  }

  const updatedUtility = await res.locals.utility.save();
  res.json(updatedUtility);
  (req.app.get('io') as TypedServer)
    .to(updatedUtility.team.toString())
    .emit('updated-utility', { utility: updatedUtility.toObject() });
});

// * Delete One
router.delete('/:utility_id', verifyAuth, getUtility, async (req, res) => {
  if (!res.locals.player.team.equals(res.locals.utility.team)) {
    return res.status(400).json({ error: 'Cannot delete a utility of another team.' });
  }
  await res.locals.utility.delete();
  res.json({ message: 'Deleted utility successfully' });
  (req.app.get('io') as TypedServer)
    .to(res.locals.utility.team.toString())
    .emit('deleted-utility', { utilityId: res.locals.utility._id });
});

export default router;
