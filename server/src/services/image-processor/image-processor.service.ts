import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import ms from 'ms';

import { ImageDeletionJob, ImageProcessorJob, ImageProcessorJobType, ImageUploadJob, ResizeParameters } from './jobs';

@Injectable()
export class ImageProcessorService implements OnModuleDestroy {
  private readonly logger = new Logger(ImageProcessorService.name);

  constructor(@InjectQueue('image-processor') private readonly imageQueue: Queue<ImageProcessorJob>) {}

  public async onModuleDestroy() {
    await this.shutdownQueue();
  }

  public shutdownQueue() {
    this.logger.debug('shutting down queue...');

    return this.imageQueue.obliterate();
  }

  /**
   *
   * @param source image upload job object
   * @param resize resize operation params
   * @returns generated name of the uploaded image
   */
  public async uploadImage(source: string, resize?: ResizeParameters) {
    const data: ImageUploadJob = {
      jobType: ImageProcessorJobType.Upload,
      source,
      resize,
    };

    const job = await this.imageQueue.add(data, {
      timeout: ms('30s'),
    });

    let finalName: string;
    try {
      finalName = (await job.finished()) as string;
    } finally {
      // enqueue the source and final image for deletion
      await this.addDeletionJob(source, finalName);
    }

    return finalName;
  }

  /**
   * queues deletion operation
   * @param source source image path
   * @param finalFileName temp final image file name
   */
  private async addDeletionJob(source: string, finalFileName?: string) {
    const data: ImageDeletionJob = {
      jobType: ImageProcessorJobType.Deletion,

      source,
      finalFileName,
    };

    await this.imageQueue.add(data, {
      // give the node runtime some time to free up handles
      delay: ms('10s'),
      removeOnFail: 5,
    });
  }
}
