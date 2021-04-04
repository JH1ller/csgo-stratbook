import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { ImageUploadProcessor } from './image-upload.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image-upload',
    }),
  ],
  // controllers: [AudioController],
  providers: [ImageUploadProcessor],
})
export class ImageProcessorModule {}
