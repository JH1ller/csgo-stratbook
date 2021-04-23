import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { User, UserSchema } from 'src/schemas/user.schema';

import { MulterConfigService } from 'src/services/multer-config.service';
import { MailerModule } from 'src/services/mail/mailer.module';
import { ImageUploaderModule } from 'src/services/image-uploader/image-uploader.module';
import { ResourceManagerModule } from 'src/services/resource-manager/resource-manager.module';
import { CaptchaModule } from 'src/services/captcha/captcha.module';

@Module({
  controllers: [UsersController],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),

    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    MailerModule,
    ImageUploaderModule,
    ResourceManagerModule,
    CaptchaModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
