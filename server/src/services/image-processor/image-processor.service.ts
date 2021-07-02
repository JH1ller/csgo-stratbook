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
   * @param data image upload job object
   * @returns minio key (file name) of the newly added image
   */
  public async addUploadJob(source: string, resize?: ResizeParameters) {
    const data: ImageUploadJob = {
      jobType: ImageProcessorJobType.Upload,

      source,
      resize,
    };

    const result = await this.imageQueue.add(data, { timeout: ms('30s') });

    // wait for completion of the job
    const target = (await result.finished()) as string;

    // enqueue image deletion
    await this.addDeletionJob(source, target);

    return target;
  }

  private addDeletionJob(sourceImage: string, targetImage: string) {
    const data: ImageDeletionJob = {
      jobType: ImageProcessorJobType.Deletion,

      sourceImage,
      targetImage,
    };

    return this.imageQueue.add(data, { timeout: ms('30s') });
  }
}
