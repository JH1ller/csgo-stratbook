import { Router } from 'express';

import { Utility, UtilityModel } from '@/models/utility';
import { imageService } from '@/services/image.service';
import { socketService } from '@/services/socket.service';
import { AccessRole } from '@/types/enums';
import { getUtility } from '@/utils/getters';
import { verifyAuth } from '@/utils/verifyToken';

const router = Router();

router.get('/', verifyAuth, async (request, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  const utilities = request.query.map
    ? await UtilityModel.find({ map: request.query.map, team: res.locals.player.team })
    : await UtilityModel.find({ team: res.locals.player.team });

  res.json(utilities);
});

// * Create One
router.post('/', verifyAuth, imageService.upload.array('images'), async (request, res) => {
  if (!res.locals.player.team) {
    return res.status(400).json({ error: "Authenticated user doesn't have a team" });
  }
  if (res.locals.player.role !== AccessRole.EDITOR) {
    return res.status(403).json({ error: 'Only editors can create utilities' });
  }

  const utility = new UtilityModel({
    name: request.body.name,
    type: request.body.type,
    map: request.body.map,
    side: request.body.side,
    mouseButton: request.body.mouseButton,
    crouch: JSON.parse(request.body.crouch),
    jump: JSON.parse(request.body.jump),
    movement: request.body.movement,
    videoLink: request.body.videoLink,
    setpos: request.body.setpos,
    description: request.body.description,
    team: res.locals.player.team,
    createdBy: res.locals.player._id,
    createdAt: new Date(),
  });

  if (request.files && Array.isArray(request.files)) {
    const fileNames = await Promise.all(
      request.files.map(async (file) => {
        return await imageService.processImage(file, 1920, 1080);
      }),
    );
    utility.images.push(...fileNames);
  }
  const newUtility = await utility.save();
  res.status(201).json(newUtility);
  socketService.to(newUtility.team.toString()).emit('created-utility', { utility: newUtility.toObject() });
});

// * Update One
router.patch('/', verifyAuth, imageService.upload.array('images'), getUtility, async (request, res) => {
  if (!res.locals.player.team.equals(res.locals.utility.team)) {
    return res.status(400).json({ error: 'Cannot update a utility of another team.' });
  }
  if (res.locals.player.role !== AccessRole.EDITOR) {
    return res.status(403).json({ error: 'Only editors can update utilities' });
  }
  const updatableFields = new Set<keyof Utility>([
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
    'labels',
  ]);
  for (const [key, value] of Object.entries(request.body)) {
    // check for undefined / null, but accept empty string ''
    if (value != undefined && updatableFields.has(key as keyof Utility)) {
      res.locals.utility[key.toString()] = value;
    }
  }

  if (request.files && Array.isArray(request.files)) {
    const fileNames = await Promise.all(
      request.files.map(async (file) => {
        return await imageService.processImage(file, 1920, 1080);
      }),
    );
    res.locals.utility.images.push(...fileNames);
  }

  if (request.body.delete) {
    const imagesToDelete = JSON.parse(request.body.delete);
    res.locals.utility.images = res.locals.utility.images.filter((image: string) => !imagesToDelete.includes(image));
    await Promise.all(
      imagesToDelete.map(async (image: string) => {
        await imageService.deleteFile(image);
      }),
    );
  }

  const updatedUtility = await res.locals.utility.save();
  res.json(updatedUtility);
  socketService.to(updatedUtility.team.toString()).emit('updated-utility', { utility: updatedUtility.toObject() });
});

// * Delete One
router.delete('/:utility_id', verifyAuth, getUtility, async (request, res) => {
  if (!res.locals.player.team.equals(res.locals.utility.team)) {
    return res.status(400).json({ error: 'Cannot delete a utility of another team.' });
  }
  if (res.locals.player.role !== AccessRole.EDITOR) {
    return res.status(403).json({ error: 'Only editors can delete utilities' });
  }
  if (res.locals.utility.images.length > 0) {
    await Promise.all(
      res.locals.utility.images.map(async (image: string) => {
        await imageService.deleteFile(image);
      }),
    );
  }
  await res.locals.utility.delete();
  res.json({ message: 'Deleted utility successfully' });
  socketService.to(res.locals.utility.team.toString()).emit('deleted-utility', { utilityId: res.locals.utility._id });
});

export default router;
