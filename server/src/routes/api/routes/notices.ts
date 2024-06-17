import * as prismic from '@prismicio/client';
import { Router } from 'express';

import { toNoticeDto } from '@/dto/notice.dto';
import { configService } from '@/services/config.service';
const router = Router();

const repositoryName = 'stratbook';
const client = prismic.createClient(repositoryName, { fetch, accessToken: configService.env.PRISMIC_TOKEN });

router.get('/', async (_, res) => {
  try {
    const notices = await client.getAllByType('notice');
    console.log(notices);
    const noticeDtos = notices.map((notice) => toNoticeDto(notice));
    res.json(noticeDtos);
  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

export default router;
