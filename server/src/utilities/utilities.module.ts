import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';

import { Utility, UtilitySchema } from 'src/schemas/utility.schema';

import { ImageUploaderModule } from 'src/services/image-uploader/image-uploader.module';
import { MulterConfigService } from 'src/services/multer-config.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),

    MongooseModule.forFeature([{ name: Utility.name, schema: UtilitySchema }]),
    ImageUploaderModule,
  ],
  controllers: [UtilitiesController],
  providers: [UtilitiesService],
  exports: [UtilitiesService],
})
export class UtilitiesModule {}
