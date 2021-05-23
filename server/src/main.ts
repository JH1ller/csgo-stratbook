import chalk from 'chalk';
import { useContainer } from 'class-validator';

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
import { MongoClient } from 'mongodb';

import { AppModule } from './app.module';
import { isDevEnv } from './common/env';

import { BullConfigService } from 'src/services/bull-config.service';
import { ImageUploaderService } from 'src/services/image-uploader/image-uploader.service';

/**
 * @summary Helper for HMR - Api reloading
 */
export class ServerEntry {
  private readonly logger = new Logger(ServerEntry.name);

  public app: INestApplication;

  private ioAdapter: IoAdapter;

  private sessionConnection: MongoClient;

  /**
   * Constructor used, to assigned an already created nest application.
   * Used to set app to testing fixtures.
   */
  constructor(testFixture?: INestApplication) {
    this.app = testFixture;
  }

  /**
   * Actual entry point for full server execution.
   */
  public async bootstrap() {
    this.logger.debug(
      `Build: ${chalk.green(process.env.BUILD_TIME)} ` +
        `git-commit: ${chalk.magenta(process.env.GIT_VERSION)} (${chalk.magenta(process.env.GIT_AUTHOR_DATE)})`
    );

    if (this.app) {
      throw new Error('do not use bootstrap with test fixtures!');
    }

    this.app = await NestFactory.create<NestExpressApplication>(AppModule, {});

    // configure nest application
    await this.configure();

    if (isDevEnv()) {
      this.useSwagger();
    }

    // all executed methods log output to console
    // mongoose.set('debug', true);

    const configService = this.app.get(ConfigService);
    const port = configService.get<number>('port');
    await this.app.listen(port);

    this.logger.debug(chalk.cyan(`Application is running on: ${chalk.magenta(await this.app.getUrl())}`));
  }

  public async dispose() {
    await this.app.close();

    // dispose worker queues
    const service = this.app.get(ImageUploaderService);
    await service.shutdownQueue();

    // dispose bulljs redis connections
    const bullConfig = this.app.get(BullConfigService);
    bullConfig.closeConnections();

    // shutdown all mongoose connections
    await Promise.all(mongoose.connections.map((con) => con.close()));
    await mongoose.disconnect();

    // dispose session-store mongodb connection
    await this.sessionConnection.close();
  }

  /**
   * Configure app.
   * Split to allow code sharing between the actual server application and test fixtures.
   */
  public async configure() {
    // set all routes to /api/<controller_name>
    this.app.setGlobalPrefix('api');

    this.app.enableShutdownHooks();

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

    // setup session-storage
    this.sessionConnection = await MongoClient.connect(configService.get<string>('database.url'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // don't merge mongoStore with session({}) as this causes resource leaks in jest
    // todo: investigate why...
    const mongoStore = MongoStore.create({
      client: this.sessionConnection,
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60, // = 14 days. Default
      autoRemove: 'interval',
      autoRemoveInterval: 10, // In minutes. Default
    });

    this.app.use(
      session({
        name: 'sid',
        secret: configService.get<string>('session.secret'),
        resave: false,
        saveUninitialized: false,
        store: mongoStore,
        cookie: {
          maxAge: configService.get<number>('session.cookie.ttl'),
          httpOnly: true,
          // disable https only cookie in dev mode
          secure: !isDevEnv(),
        },
      })
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // setup DI in class-validator
    useContainer(this.app.select(AppModule), { fallbackOnErrors: true });

    this.app.useGlobalPipes(
      new ValidationPipe({
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
}

/**
 * this export, for webpack-watch-sandbox.js
 */
export default () => new ServerEntry();

if (process.env.STANDALONE_BUILD) {
  const entry = new ServerEntry();

  entry
    .bootstrap() // launch app entry
    .catch((err) => console.log(chalk.red(`failed to start service ${err as string}`)));
}

if (module.hot) {
  module.hot.accept();
}
