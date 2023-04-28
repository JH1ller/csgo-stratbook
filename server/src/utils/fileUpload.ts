import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { unlinkSync, renameSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { Upload } from '@aws-sdk/lib-storage';
import AWS_S3, { S3 } from '@aws-sdk/client-s3';
import { Request, RequestHandler } from 'express';
import ImageProcessError from './errors/ImageProcessError';
import { Log } from './logger';

const s3 = new S3({
  //accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  region: 'eu-central-1',
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
        Log.error('fileUpload::uploadSingle', 'MulterError: ', error.message, req.file);
        return res.status(500).send({ error: 'An error occurred during image upload.' });
      } else if (error) {
        Log.error('fileUpload::uploadSingle', error, req.file);
        return res.status(500).send({ error: 'An error occurred during image upload.' });
      }
      next();
    });
  };

export const uploadMultiple =
  (field: string): RequestHandler =>
  (req, res, next) => {
    multerInstance.array(field)(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        Log.error('fileUpload::uploadSingle', 'MulterError: ', error.message, req.file);
        return res.status(500).send({ error: 'An error occurred during image upload.' });
      } else if (error) {
        Log.error('fileUpload::uploadSingle', error, req.file);
        return res.status(500).send({ error: 'An error occurred during image upload.' });
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
    Log.error('fileUpload::processImage', error.message);
    throw new ImageProcessError(error);
  }
};

export const uploadFile = async (filepath: string, filename: string) => {
  try {
    const fileContent = readFileSync(filepath);
    const params: AWS_S3.PutObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: filename, // filename on S3
      Body: fileContent,
    };
    const data: AWS_S3.CompleteMultipartUploadOutput = await new Upload({
      client: s3,
      params,
    }).done();
    Log.success('fileUpload::uploadFile', `File uploaded successfully. Key: ${data.Location}`);

    return data;
  } catch (error) {
    Log.error('fileUpload::uploadFile', error.message);
    throw error;
  }
};

export const deleteFile = async (filename: string): Promise<void> => {
  try {
    const params: AWS_S3.DeleteObjectCommandInput = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: filename, // filename on S3
    };

    const data = await s3.deleteObject(params);

    Log.success('fileUpload::deleteFile', `File deleted successfully. Key: ${filename}`);
    return;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
