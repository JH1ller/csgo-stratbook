import chalk from 'chalk';
import fs from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { Job } from 'bull';
import sharp from 'sharp';
import * as Minio from 'minio';
import imageType from 'image-type';

import {
  ImageDeletionJob,
  ImageProcessorJob,
  ImageProcessorJobType,
  ImageUploadJob,
} from 'src/services/image-processor/jobs';
import { isDevEnv } from 'src/common/env';

// connect to minio
const client = new Minio.Client({
  accessKey: process.env.MINIO_ACCESS_KEY_ID,
  secretKey: process.env.MINIO_SECRET_ACCESS_KEY,

  endPoint: process.env.MINIO_ENDPOINT,
  port: Number.parseInt(process.env.MINIO_PORT, 10),
  useSSL: process.env.MINIO_USE_SSL.toLowerCase() === 'true',
});

// specify image bucket name
const imageBucket = process.env.MINIO_IMAGE_BUCKET;

console.log(chalk.green(`[image-processor] launched with pid: ${process.pid} (bucket: ${imageBucket})`));

export default async (job: Job<ImageProcessorJob>) => {
  console.log(`[${process.pid}] ${JSON.stringify(job.data)}`);

  const { jobType } = job.data;

  switch (jobType) {
    case ImageProcessorJobType.Upload: {
      return uploadImage(job.data as ImageUploadJob);
    }
    case ImageProcessorJobType.Deletion: {
      return deleteImagePair(job.data as ImageDeletionJob);
    }
  }
};

/**
 * Test if the specified input file is an actual image
 * @param source path to image
 * @returns is image
 */
async function isFileImage(source: string) {
  const stream = fs.createReadStream(source, { start: 0, end: imageType.minimumBytes });

  try {
    // await wrapper for read streams
    const chunk = await new Promise<Buffer>((resolve, reject) => {
      stream.on('data', (dataChunk) => {
        if (dataChunk instanceof Buffer) {
          return resolve(dataChunk);
        }

        return resolve(Buffer.from(dataChunk));
      });
      stream.on('error', (error) => reject(error));
    });

    if (chunk === null) {
      throw new Error(`failed to read image chunk: ${source}`);
    }

    const type = imageType(chunk);
    switch (type.ext) {
      case 'jpg':
      case 'jpm':
      case 'png':
      case 'gif':
      case 'webp':
      case 'bmp':
        return true;
    }

    return false;
  } catch (err) {
    console.log(err);
  } finally {
    stream.close();
  }
}

async function uploadImage(jobData: ImageUploadJob) {
  const { source, resize } = jobData;

  if (!(await isFileImage(source))) {
    throw new Error(`file is not an image: ${source}`);
  }

  // default webp quality is 80
  const processor = sharp(source).webp({ quality: 90 });

  if (resize) {
    processor.resize(resize.width, resize.height);
  }

  const newFileName = uuid() + path.extname(source);
  const destination = path.resolve(path.dirname(source), newFileName);

  // run processor chain
  await processor.toFile(destination);

  const stream = fs.createReadStream(destination);

  try {
    const result = await client.putObject(imageBucket, newFileName, stream);

    if (isDevEnv()) {
      console.log(`File upload completed: ${result}`);
    }
  } finally {
    stream.close();
  }

  return newFileName;
}

async function deleteImagePair(jobData: ImageDeletionJob) {
  const { sourceImage, targetImage } = jobData;

  console.log('unlink dest');
  await unlink(targetImage);

  // delete source file
  console.log('unlink src');
  await unlink(sourceImage);
}
