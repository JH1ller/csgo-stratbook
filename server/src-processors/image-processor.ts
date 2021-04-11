import { Job } from 'bull';

import sharp from 'sharp';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import imageType, { ImageType } from 'image-type';

interface ImageResizeJob {
  fileSource: string;
  width: number;
  height: number;
  fileDestination: string;
}

// connect to minio/s3
const s3 = new AWS.S3({
  credentials: new AWS.Credentials({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  }),

  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

function isFileImage(source: string) {
  const stream = fs.createReadStream(source);

  try {
    const chunk = stream.read(imageType.minimumBytes) as Buffer | null;
    if (chunk === null) {
      throw new Error(`failed to read image chunk: ${source}`);
    }

    const type = imageType(chunk);
    switch (type.ext) {
      case 'jpg':
      case 'png':
      case 'gif':
      case 'webp':
      case 'bmp':
        return true;
    }

    return false;
  } finally {
    stream.destroy();
  }
}

export default async (job: Job<ImageResizeJob>) => {
  console.log(`[${process.pid}] ${JSON.stringify(job.data)}`);

  const { fileSource, width, height, fileDestination } = job.data;

  if (!isFileImage(fileSource)) {
    throw new Error(`file is not an image: ${fileSource}`);
  }

  await sharp(fileSource)
    .webp({
      // default 80
      quality: 90,
    })
    .resize(width, height)
    .toFile(fileDestination);

  const stream = fs.createReadStream(fileDestination, {
    autoClose: true,
  });

  try {
    const fileName = path.basename(fileSource);
    const result = await s3
      .upload({
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: stream,
      })
      .promise();

    console.log(`File upload done: ${result.Location}`);
  } finally {
    stream.destroy();
  }
};
