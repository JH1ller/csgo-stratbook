import { Job } from 'bull';

import sharp from 'sharp';

interface ImageResizeJob {
  fileSource: string;
  width: number;
  height: number;
  fileDestination: string;
}

export default async (job: Job<ImageResizeJob>) => {
  console.log(`[${process.pid}] ${JSON.stringify(job.data)}`);

  // const { fileSource, width, height, fileDestination } = job.data;

  // const info = await sharp(fileSource).resize(width, height).toFile(fileDestination);
  // console.log(info);

  await new Promise((resolve) => {
    resolve(true);
  });
};
