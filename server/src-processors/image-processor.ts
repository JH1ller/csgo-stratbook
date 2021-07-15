import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { unlink } from 'fs/promises';
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

// disable sharp cache, else we may have dangling file handles
sharp.cache(false);

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
const uploadTempDir = process.env.UPLOAD_TEMP_DIR;

console.log(chalk.green(`[image-processor] launched with pid: ${process.pid}`));
console.log(chalk.green(`[image-processor] using bucket: ${imageBucket} and temp_dir: ${uploadTempDir}`));

if (!fs.existsSync(uploadTempDir)) {
  throw new Error(`upload temp dir ${uploadTempDir} does not exist!`);
}

/**
 * bull-js entry point
 */
export default async (job: Job<ImageProcessorJob>) => {
  const { jobType } = job.data;

  switch (jobType) {
    case ImageProcessorJobType.Upload: {
      return uploadImage(job.data as ImageUploadJob);
    }
    case ImageProcessorJobType.Deletion: {
      return deleteTemporaryImages(job.data as ImageDeletionJob);
    }
  }
};

/**
 * Test if the specified input file is an actual image
 * @param source path to image
 * @returns is image
 */
async function isFileImage(source: string) {
  const stream = fs.createReadStream(source, {
    start: 0,
    end: imageType.minimumBytes,
  });

  try {
    const chunk = await new Promise<Buffer>((resolve, reject) => {
      stream.on('data', (dataChunk) => {
        if (dataChunk instanceof Buffer) {
          return resolve(dataChunk);
        }

        return resolve(Buffer.from(dataChunk));
      });

      stream.on('error', reject);
    });

    if (chunk) {
      const type = imageType(chunk);
      if (type) {
        switch (type.ext) {
          case 'jpg':
          case 'png':
          case 'gif':
          case 'webp':
            return true;
        }
      }
    }
  } finally {
    stream.close();
  }

  return false;
}

/**
 * upload file into the target minio bucket
 * @param imagePath path of the object to upload to
 * @param objectName stored object name
 */
async function putInBucket(imagePath: string, objectName: string) {
  const stream = fs.createReadStream(imagePath);

  try {
    await client.putObject(imageBucket, objectName, stream);
  } finally {
    stream.destroy();
  }
}

/**
 * Upload image to minio bucket
 * @param jobData job descriptor
 * @returns name of the converted, compressed and resized image
 */
async function uploadImage(jobData: ImageUploadJob) {
  const { source, resize } = jobData;

  const isImage = await isFileImage(source);
  if (!isImage) {
    throw new Error(`file is not an image: ${source}`);
  }

  const finalName = uuid();
  const destination = path.resolve(uploadTempDir, finalName);

  // splitting this declaration caused a file handle leak
  // so for now keep both version.
  // TODO: investigate why this happens

  if (resize) {
    await sharp(source)
      .resize(resize.width, resize.height)
      .webp({
        quality: 90, // default webp quality is 80
      })
      .toFile(destination);
  } else {
    await sharp(source)
      .webp({
        quality: 90,
      })
      .toFile(destination);
  }

  await putInBucket(destination, finalName);

  return finalName;
}

async function deleteTemporaryImages(jobData: ImageDeletionJob) {
  const { source, finalFileName } = jobData;

  if (fs.existsSync(source)) {
    await unlink(source);
  }

  if (finalFileName) {
    const destination = path.resolve(uploadTempDir, finalFileName);

    if (fs.existsSync(destination)) {
      await unlink(destination);
    }
  }
}
