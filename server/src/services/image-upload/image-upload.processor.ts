import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import * as sharp from 'sharp';

@Processor('image-upload')
export class ImageUploadProcessor {
  private readonly logger = new Logger(ImageUploadProcessor.name);

  @Process('resize')
  public processResize(job: Job) {
    this.logger.debug('resizing image');

    this.logger.debug('uploading to s3');
  }
}
