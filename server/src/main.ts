import chalk from 'chalk';

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import morgan from 'morgan';
import CookieParser from 'cookie-parser';
import { json } from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import helmet from 'helmet';
import passport from 'passport';

import { AppModule } from './app.module';
import { isDevEnv } from './common/env';

/**
 * @summary Helper for HMR - Api reloading
 */
class Main {
  private readonly logger = new Logger(Main.name);

  private app: NestExpressApplication;

  public async bootstrap() {
    this.logger.debug(
      `Build: ${chalk.green(process.env.BUILD_TIME)} ` +
        `git-commit: ${chalk.magenta(process.env.GIT_VERSION)} (${chalk.magenta(process.env.GIT_AUTHOR_DATE)})`
    );

    this.app = await NestFactory.create<NestExpressApplication>(AppModule, {});

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

    // setup session-storage
    this.app.use(
      session({
        name: 'sid',
        secret: configService.get<string>('session.secret'),
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
          mongoUrl: configService.get<string>('database.url'),
          collectionName: 'sessions',
          ttl: 14 * 24 * 60 * 60, // = 14 days. Default
        }),

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

    this.app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false, value: false },
      })
    );

    this.app.enableCors({
      credentials: true,
      origin: true,
    });

    if (isDevEnv()) {
      this.useSwagger();
    }

    const port = configService.get<number>('port');
    await this.app.listen(port);

    this.logger.debug(chalk.cyan(`Application is running on: ${chalk.magenta(await this.app.getUrl())}`));
  }

  public dispose() {
    return this.app.close();
  }

  private useSwagger() {
    // create swagger on route /swagger
    const route = 'swagger';

    const config = new DocumentBuilder()
      .setTitle('csgo-stratbook api')
      .setDescription('Stratbook REST API')
      .setVersion('0.1')
      .build();

    const document = SwaggerModule.createDocument(this.app, config);
    SwaggerModule.setup(route, this.app, document);

    this.logger.debug(`Swagger running on route: ${chalk.magenta(`/${route}`)}`);
  }
}

/**
 * this export for webpack-watch-sandbox.js
 */
export default () => new Main();

if (process.env.STANDALONE_BUILD) {
  const main = new Main();

  main
    .bootstrap() // launch app entry
    .catch((err) => console.log(chalk.red(`failed to start service ${err as string}`)));
}

if (module.hot) {
  module.hot.accept();
}
