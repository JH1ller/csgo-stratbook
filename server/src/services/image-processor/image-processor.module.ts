import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import path from 'path';
import process from 'process';

import { ImageProcessorService } from './image-processor.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'image-processor',
      processors: [path.join(process.cwd(), 'dist/image-processor.js')],
    }),
  ],

  providers: [ImageProcessorService],
  exports: [ImageProcessorService],
})
export class ImageProcessorModule {}
