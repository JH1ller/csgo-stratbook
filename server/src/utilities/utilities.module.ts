import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { UtilitiesController } from './utilities.controller';
import { UtilitiesService } from './utilities.service';

import { Utility, UtilitySchema } from 'src/schemas/utility.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

import { MulterConfigService } from 'src/services/multer-config.service';
import { ImageUploaderModule } from 'src/services/image-uploader/image-uploader.module';
import { ResourceManagerModule } from 'src/services/resource-manager/resource-manager.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),

    MongooseModule.forFeature([
      { name: Utility.name, schema: UtilitySchema },
      { name: User.name, schema: UserSchema },
    ]),

    ImageUploaderModule,
    ResourceManagerModule,
  ],
  controllers: [UtilitiesController],
  providers: [UtilitiesService],
  exports: [UtilitiesService],
})
export class UtilitiesModule {}
