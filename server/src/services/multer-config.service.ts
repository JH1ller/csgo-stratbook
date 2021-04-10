import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';

import multer from 'multer';
import { randomBytes } from 'crypto';
import { extname } from 'path';
import AWS from 'aws-sdk';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createMulterOptions(): MulterModuleOptions {
    const s3 = new AWS.S3({
      credentials: new AWS.Credentials({
        accessKeyId: this.configService.get<string>('s3.accessKeyId'),
        secretAccessKey: this.configService.get<string>('s3.secretAccessKey'),
      }),

      endpoint: 'http://127.0.0.1:9000',
    });

    return {
      storage: multer.diskStorage({
        destination: this.configService.get<string>('persistence.tmp'),
        filename: (_req, file, next) => {
          const newName = randomBytes(20).toString('hex') + extname(file.originalname);
          next(null, newName);
        },
      }),

      limits: {
        fileSize: 10_000_000, // * 10 MB
      },

      fileFilter: (_req, file, next) => {
        const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.webp'];

        if (allowedFileTypes.includes(extname(file.originalname))) {
          return next(null, true);
        }

        return next(null, false);
      },
    };
  }
}
