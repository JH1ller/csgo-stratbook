import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';

import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

import { Team, TeamSchema } from 'src/schemas/team.schema';

import { UsersModule } from 'src/users/users.module';

import { MulterConfigService } from 'src/services/multer-config.service';
import { ImageUploaderModule } from 'src/services/image-uploader/image-uploader.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    MongooseModule.forFeature([{ name: Team.name, schema: TeamSchema }]),
    UsersModule,
    ImageUploaderModule,
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
