import { Router } from 'express';

import { NoticeModel } from '@/models/notice';

const router = Router();

router.get('/', async (req, res) => {
  const notices = await NoticeModel.find({ expires: { $gte: new Date() } });

  res.json(notices);
});

router.get('/create', async (req, res) => {
  const notice = new NoticeModel({
    version: '1.0.0',
    content: 'Welcome to',
    expires: new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000), // Expires in three months
  });
  await notice.save();
  return res.status(200);
});

export default router;
