import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  private readonly logger = new Logger(MulterConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  public createMulterOptions(): MulterModuleOptions {
    const destination = this.configService.get<string>('upload.tempDir');
    this.logger.debug(`Creating multer diskStorage on ${destination}`);

    return {
      storage: multer.diskStorage({
        destination,

        filename(_req, _file, next) {
          // assign random id to file
          const newFileName = uuid();

          next(null, newFileName);
        },
      }),

      limits: {
        fileSize: 10_000_000, // * 10 MB
      },

      fileFilter(_req, file, next) {
        const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

        if (allowedFileTypes.includes(extname(file.originalname))) {
          return next(null, true);
        }

        // ignore files, which doesn't have a matching file extension
        return next(null, false);
      },
    };
  }
}
