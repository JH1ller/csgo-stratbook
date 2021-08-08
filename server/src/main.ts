import chalk from 'chalk';
import { useContainer } from 'class-validator';
import os from 'os';

import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe, ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

import morgan from 'morgan';
import CookieParser from 'cookie-parser';
import { json } from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import passport from 'passport';
import mongoose from 'mongoose';

import { AppModule } from './app.module';
import { isDevEnv } from './common/env';

import { BullConfigService } from 'src/services/bull-config.service';
import { ImageProcessorService } from 'src/services/image-processor/image-processor.service';
import { MinioService } from './services/minio/minio-service.service';

/**
 * @summary Helper for HMR - Api reloading
 */
export class ServerEntry {
  private readonly logger = new Logger(ServerEntry.name);

  public app: INestApplication;

  private ioAdapter: IoAdapter;

  private mongoStore: MongoStore;

  /**
   * Actual entry point for full server execution.
   */
  public async bootstrap() {
    this.logger.debug(
      `Build: ${chalk.green(process.env.BUILD_TIME)} ` +
        `git-commit: ${chalk.magenta(process.env.GIT_VERSION)} (${chalk.magenta(process.env.GIT_AUTHOR_DATE)})`
    );

    this.printOsDebugInfo();

    this.app = await NestFactory.create<NestExpressApplication>(AppModule, {});
    this.app.enableShutdownHooks();

    // configure nest application
    // set all routes to /api/<controller_name>
    this.app.setGlobalPrefix('api');

    const configService = this.app.get(ConfigService);

    if (isDevEnv()) {
      this.app.use(morgan('common'));

      // we need to disable CSP for swagger in development mode
      this.app.use(
        helmet({
          contentSecurityPolicy: false,
        })
      );
    } else {
      this.app.use(helmet());
    }

    this.app.use(CookieParser());

    // parse application/json
    this.app.use(json());

    this.mongoStore = MongoStore.create({
      mongoUrl: configService.get<string>('database.url'),
      collectionName: 'sessions',
      autoRemove: 'interval',
      ttl: 14 * 24 * 60 * 60, // = 14 days. Default
    });

    this.app.use(
      session({
        name: 'sid',
        secret: configService.get<string>('session.secret'),
        resave: false,
        saveUninitialized: false,
        store: this.mongoStore,
        cookie: {
          maxAge: configService.get<number>('session.cookie.ttl'),

          httpOnly: true,

          // disable secure cookies as this site is only served by a proxy
          secure: false,
        },
      })
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // setup DI in class-validator
    useContainer(this.app.select(AppModule), { fallbackOnErrors: true });

    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false, value: false },
      })
    );

    this.app.useGlobalInterceptors(
      new ClassSerializerInterceptor(this.app.get(Reflector), {
        strategy: 'excludeAll',
      })
    );

    this.app.enableCors({
      credentials: true,
      origin: true,
    });

    // validate minio bucket configuration
    const minioService = this.app.get(MinioService);
    await minioService.validateBuckets();

    if (isDevEnv()) {
      this.useSwagger();

      // all executed methods log output to console
      mongoose.set('debug', true);
    }

    const port = configService.get<number>('port');
    await this.app.listen(port);

    this.logger.debug(chalk.cyan(`Application is running on: ${chalk.magenta(await this.app.getUrl())}`));
  }

  public async dispose() {
    this.logger.debug('service is going down...');

    await this.app.close();

    // dispose worker queues
    const service = this.app.get(ImageProcessorService);
    await service.shutdownQueue();

    // dispose bulljs redis connections
    const bullConfig = this.app.get(BullConfigService);
    bullConfig.closeConnections();

    // shutdown all mongoose connections
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();

    // dispose session-store mongodb connection
    await this.mongoStore.close();

    // wait a bit, until all queues are flushed out
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  private useSwagger() {
    // create swagger on route /swagger
    const route = 'swagger';

    const config = new DocumentBuilder()
      .setTitle('csgo-stratbook api')
      .setDescription('Stratbook REST API')
      .setVersion('2.0.1')
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup(route, this.app, document);

    this.logger.debug(`Swagger running on route: ${chalk.magenta(`/${route}`)}`);
  }

  private printOsDebugInfo() {
    const cpus = os.cpus();

    if (cpus.length < 1) {
      this.logger.debug('Failed to get cpu info!');
    } else {
      this.logger.debug(`System processor: ${cpus[0].model.trimEnd()}, speed: ${cpus[0].speed}, ${cpus.length} cores`);
    }
  }
}

/**
 * export entry point factory
 */
export default () => new ServerEntry();

if (process.env.STANDALONE_BUILD) {
  const entry = new ServerEntry();

  // launch server
  void entry.bootstrap();
}

if (module.hot) {
  module.hot.accept();
}
