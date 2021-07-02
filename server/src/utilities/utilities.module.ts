import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';

import { Utility, UtilitySchema } from 'src/schemas/utility.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

import { MulterConfigService } from 'src/services/multer-config.service';
import { ImageProcessorModule } from 'src/services/image-processor/image-processor.module';
import { MinioModule } from 'src/services/minio/minio-service.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),

    MongooseModule.forFeature([
      { name: Utility.name, schema: UtilitySchema },
      { name: User.name, schema: UserSchema },
    ]),

    ImageProcessorModule,
    MinioModule,
  ],

  controllers: [UtilitiesController],
  providers: [UtilitiesService],
  exports: [UtilitiesService],
})
export class UtilitiesModule {}
