import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { ImageUploadJob } from './jobs/image-upload';

@Injectable()
export class ImageUploaderService {
  constructor(@InjectQueue('image-uploader') private readonly imageQueue: Queue<ImageUploadJob>) {}

  public shutdownQueue() {
    return this.imageQueue.obliterate();
  }

  /**
   *
   * @param data image upload job object
   * @returns s3 key (file name) of the newly added image
   */
  public async addJob(data: ImageUploadJob) {
    const result = await this.imageQueue.add(data);

    // wait for completion of the job
    return (await result.finished()) as string;
  }
}
