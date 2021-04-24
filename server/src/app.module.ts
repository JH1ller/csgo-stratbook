import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from './app.service';

import configuration from './config/configuration';
import { validate } from './config/env.validation';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { StrategiesModule } from './strategies/strategies.module';
import { UtilitiesModule } from './utilities/utilities.module';
import { LandingModule } from './landing/landing.module';
import { DrawToolModule } from './draw-tool/draw-tool.module';
import { AdministrationModule } from './administration/administration.module';

import { ValidatorsModule } from './common/validators/validators.module';

import { BullConfigService } from './services/bull-config.service';
import { CaptchaModule } from './services/captcha/captcha.module';
import { ResourceManagerModule } from './services/resource-manager/resource-manager.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validate,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.url'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,

        validateOptions: true,
      }),
      inject: [ConfigService],
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      useClass: BullConfigService,
    }),

    ValidatorsModule,

    CaptchaModule,
    ResourceManagerModule,

    AuthModule,
    UsersModule,
    StrategiesModule,
    TeamsModule,
    UtilitiesModule,
    LandingModule,
    DrawToolModule,
    AdministrationModule,
  ],
  providers: [AppService],
})
export class AppModule {}
