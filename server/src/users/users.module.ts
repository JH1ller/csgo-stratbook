import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { User, UserSchema } from 'src/schemas/user.schema';
import { MulterConfigModule } from 'src/services/multer/multer-config.module';
import { MulterConfigService } from 'src/services/multer/multer-config.service';

import { MailerModule } from 'src/services/mail/mailer.module';

@Module({
  controllers: [UsersController],
  imports: [
    MulterModule.registerAsync({
      imports: [MulterConfigModule],
      useExisting: MulterConfigService,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailerModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
