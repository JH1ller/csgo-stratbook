import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createMulterOptions(): MulterModuleOptions {
    const destination = this.configService.get<string>('upload.tempDir');
    Logger.debug(`Creating multer diskStorage on ${destination}`, MulterConfigService.name);

    return {
      storage: multer.diskStorage({
        destination,

        filename: (_req, file, next) => {
          const newName = uuid() + extname(file.originalname);
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
