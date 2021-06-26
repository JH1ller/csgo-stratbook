import chalk from 'chalk';
import fs from 'fs';
import { unlink } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

import { Job } from 'bull';
import sharp from 'sharp';
import AWS from 'aws-sdk';
import imageType from 'image-type';

import { ImageUploadJob } from 'src/services/image-uploader/jobs/image-upload';
import { isDevEnv } from 'src/common/env';

// connect to minio/s3
const s3Client = new AWS.S3({
  credentials: new AWS.Credentials({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  }),

  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

// minor connection test
if (isDevEnv()) {
  s3Client.listBuckets((err, buckets) => {
    console.log(err, buckets);
  });
}

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
    stream.destroy();
  }
}

export default async (job: Job<ImageUploadJob>) => {
  console.log(`[${process.pid}] ${JSON.stringify(job.data)}`);

  const { source, resize } = job.data;

  if (!(await isFileImage(source))) {
    throw new Error(`file is not an image: ${source}`);
  }

  // default webp quality is 80
  const processor = sharp(source).webp({ quality: 90 });

  if (resize) {
    processor.resize(resize.width, resize.height);
  }

  const newFileName = randomBytes(20).toString('hex') + path.extname(source);
  const destination = path.resolve(path.dirname(source), newFileName);

  // run processor chain
  await processor.toFile(destination);

  const stream = fs.createReadStream(destination, {
    autoClose: true,
  });

  try {
    const result = await s3Client
      .upload({
        Bucket: process.env.S3_IMAGE_BUCKET,
        Key: newFileName,
        Body: stream,
      })
      .promise();

    console.log(`File upload done: ${result.Location}`);

    // delete both temp files
    await unlink(source);
    await unlink(destination);

    return newFileName;
  } finally {
    stream.destroy();
  }
};

console.log(chalk.green(`[image-processor] launched with pid: ${process.pid}`));
