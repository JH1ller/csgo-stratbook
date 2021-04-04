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

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  // set all routes to /api/<controller_name>
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  if (isDevEnv()) {
    app.use(morgan('common'));

    // we need to disable CSP for swagger in development mode
    app.use(
      helmet({
        contentSecurityPolicy: false,
      })
    );
  } else {
    app.use(helmet());
  }

  app.use(CookieParser());

  // parse application/json
  app.use(json());

  // setup session-storage
  app.use(
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

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
    })
  );

  app.enableCors({
    credentials: true,
    origin: true,
  });

  if (isDevEnv()) {
    useSwagger(app);
  }

  const port = configService.get<number>('port');
  await app.listen(port);

  Logger.debug(chalk.cyan(`Application is running on: ${chalk.magenta(await app.getUrl())}`));

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      app
        .close() // print close exception to console
        .catch((err) => console.log(chalk.red(`failed to shutdown service ${err as string}`)));
    });
  }
}

function useSwagger(app: NestExpressApplication) {
  // create swagger on route /swagger
  const route = 'swagger';

  const config = new DocumentBuilder()
    .setTitle('csgo-stratbook api')
    .setDescription('Stratbook REST API')
    .setVersion('0.1')
    .addTag('stratbook')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(route, app, document);

  Logger.debug(`Swagger running on route: ${chalk.magenta(`/${route}`)}`);
}

//
// stratbook - backend entry point
//

Logger.debug(
  `Build: ${chalk.green(process.env.BUILD_TIME)} ` +
    `git-commit: ${chalk.magenta(process.env.GIT_VERSION)} on ${chalk.magenta(process.env.GIT_AUTHOR_DATE)}`
);

bootstrap() // bootstrap application
  .catch((err) => console.log(chalk.red(`failed to start service ${err as string}`)));
