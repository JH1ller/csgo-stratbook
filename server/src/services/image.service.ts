import crypto from 'node:crypto';
import { mkdir, readFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import multer, { type Multer } from 'multer';
import sharp from 'sharp';

import ImageProcessError from '@/utils/errors/ImageProcessError';
import { getErrorMessage } from '@/utils/errors/parseError';
import { Logger } from '@/utils/logger';

import { configService } from './config.service';

const logger = new Logger('ImageService');

class ImageService extends S3Client {
  upload: Multer;
  readonly directory = 'public/upload/';
  readonly allowedFileTypes = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
  readonly maxFileSize = 10_000_000; // * 10 MB

  constructor() {
    super({
      credentials: {
        accessKeyId: configService.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: configService.env.AWS_SECRET_ACCESS_KEY,
      },
      region: 'eu-central-1',
    });
    const fileStorage = multer.diskStorage({
      destination: this.directory,
      filename: function (_, file, next) {
        next(null, crypto.randomUUID() + path.extname(file.originalname));
      },
    });

    this.upload = multer({
      storage: fileStorage,
      limits: {
        fileSize: this.maxFileSize,
      },
      fileFilter: (_, file, next) => {
        if (this.allowedFileTypes.includes(path.extname(file.originalname))) {
          next(null, true);
        } else {
          next(null, false);
        }
      },
    });
  }

  private updateFileExtension(fileName: string, extension: string): string {
    const extension_ = extension.startsWith('.') ? extension : '.' + extension;
    return fileName.replace(/\.[^./]+$/, extension_);
  }

  private async calculateDimensions(
    filePath: string,
    targetWidth: number,
    targetHeight: number,
  ): Promise<{ width: number | null; height: number | null }> {
    const { width, height } = await sharp(filePath).metadata();
    return {
      width: targetWidth ? Math.min(targetWidth, width!) : null,
      height: targetHeight ? Math.min(targetHeight, height!) : null,
    };
  }

  async processImage(file: Express.Multer.File, targetWidth: number, targetHeight: number) {
    try {
      const tempDir = path.resolve(file.destination, 'temp');
      await mkdir(tempDir, { recursive: true });

      const { width, height } = await this.calculateDimensions(file.path, targetWidth, targetHeight);
      const targetFileName = this.updateFileExtension(file.filename, 'webp');

      await sharp(file.path)
        .resize(width, height)
        .webp({ quality: 70 })
        .toFile(path.resolve(file.destination, 'temp', targetFileName));

      await unlink(file.path);
      await rename(
        path.resolve(file.destination, 'temp', targetFileName),
        path.resolve(file.destination, targetFileName),
      );
      await this.uploadFile(path.resolve(file.destination, targetFileName), targetFileName);
      return targetFileName;
    } catch (error) {
      throw new ImageProcessError(getErrorMessage(error));
    }
  }

  async uploadFile(filepath: string, filename: string) {
    try {
      const fileContent = await readFile(filepath);

      const command = new PutObjectCommand({
        Bucket: configService.env.S3_BUCKET_NAME,
        Key: filename, // filename on S3
        Body: fileContent,
      });

      await this.send(command);

      logger.success(`File uploaded successfully.`);
    } catch (error) {
      throw new ImageProcessError(getErrorMessage(error));
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: configService.env.S3_BUCKET_NAME,
        Key: filename, // filename on S3
      });

      await this.send(command);

      logger.success(`File deleted successfully. Key: ${filename}`);
    } catch (error) {
      throw new ImageProcessError(getErrorMessage(error));
    }
  }
}

const imageService = new ImageService();

export { imageService };
