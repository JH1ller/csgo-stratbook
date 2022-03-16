import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { unlinkSync, renameSync, readFileSync, mkdirSync, existsSync } from 'fs';
import AWS from 'aws-sdk';
import { Request, NextFunction, RequestHandler } from 'express';
import ImageProcessError from './errors/ImageProcessError';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const fileStorage = multer.diskStorage({
  destination: function (_req, _file, next) {
    next(null, 'public/upload/');
  },
  filename: function (req, file, next) {
    next(null, crypto.randomBytes(20).toString('hex') + path.extname(file.originalname));
  },
});

const fileLimits = {
  fileSize: 10_000_000, // * 10 MB
};

const fileFilter = (_req: Request, file: Express.Multer.File, next: FileFilterCallback) => {
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.webp'];

  if (allowedFileTypes.includes(path.extname(file.originalname))) {
    next(null, true);
  } else {
    next(null, false);
  }
};

const multerInstance = multer({
  storage: fileStorage,
  limits: fileLimits,
  fileFilter: fileFilter,
});

export const uploadSingle =
  (field: string): RequestHandler =>
  (req, res, next) => {
    multerInstance.single(field)(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        return res.status(400).send({ error: error.message });
      } else if (error) {
        return res.status(400).send({ error: error });
      }
      next();
    });
  };

export const uploadMultiple =
  (field: string): RequestHandler =>
  (req, res, next) => {
    multerInstance.array(field)(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        return res.status(400).send({ error: error.message });
      } else if (error) {
        return res.status(400).send({ error: error });
      }
      next();
    });
  };

export const changeExtension = (fileName: string, extension: string): string => {
  const segments = fileName.split('.');
  segments.splice(segments.length - 1, 1, extension);
  return segments.join('.');
};

export const calculateDimensions = async (filePath: string, targetWidth: number, targetHeight: number) => {
  const { width, height } = await sharp(filePath).metadata();
  return [targetWidth ? Math.min(targetWidth, width!) : null, targetHeight ? Math.min(targetHeight, height!) : null];
};

export const processImage = async (file: Express.Multer.File, targetWidth: number, targetHeight: number) => {
  try {
    const tempDir = path.resolve(file.destination, 'temp');
    if (!existsSync(tempDir)) {
      mkdirSync(tempDir);
    }
    const [width, height] = await calculateDimensions(file.path, targetWidth, targetHeight);
    const targetFileName = changeExtension(file.filename, 'webp');
    await sharp(file.path)
      .resize(width, height)
      .webp({ quality: 70 })
      .toFile(path.resolve(file.destination, 'temp', targetFileName));
    unlinkSync(file.path);
    renameSync(path.resolve(file.destination, 'temp', targetFileName), path.resolve(file.destination, targetFileName));
    await uploadFile(path.resolve(file.destination, targetFileName), targetFileName);
    return targetFileName;
  } catch (error) {
    console.error(error);
    throw new ImageProcessError(error);
  }
};

export const uploadFile = (filepath: string, filename: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileContent = readFileSync(filepath);
      const params: AWS.S3.PutObjectRequest = {
        Bucket: process.env.S3_BUCKET_NAME!,
        Key: filename, // filename on S3
        Body: fileContent,
      };

      const data = await s3.upload(params).promise();
      console.log(`File uploaded successfully. ${data.Location}`);
      resolve(data.Location);
    } catch (error) {
      console.error(error);
      reject(error);
    }
  });
};

export const deleteFile = async (filename: string): Promise<void> => {
  try {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: filename, // filename on S3
    };

    const data = await s3.deleteObject(params).promise();

    // TODO: check if data.Location is correct, seems to return undefined
    console.log(`File deleted successfully. ${data.$response.data}`);
    return;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
