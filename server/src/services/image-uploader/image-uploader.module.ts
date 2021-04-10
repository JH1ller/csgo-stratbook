import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import path from 'path';
import process from 'process';

import { ImageUploaderService } from './image-uploader.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image-uploader',
      processors: [path.join(process.cwd(), 'dist/image-processor.js')],
    }),
  ],

  providers: [ImageUploaderService],
  exports: [ImageUploaderService],
})
export class ImageUploaderModule {}
