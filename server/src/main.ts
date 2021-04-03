import * as chalk from 'chalk';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { fastifyHelmet } from 'fastify-helmet';
import FastifySecureSession from 'fastify-secure-session';
import FastifyCsrf from 'fastify-csrf';
import FastifyPassport from 'fastify-passport';

import * as PassportLocal from 'passport-local';

import { AppModule } from './app.module';
import { isDevEnv } from './utils/env';

interface User {
  id: string;
}

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: isDevEnv(),
    })
  );

  // set all routes to /api/<controller_name>
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  if (isDevEnv()) {
    // we need to disable CSP for swagger in development mode
    await app.register(fastifyHelmet, {
      contentSecurityPolicy: false,
    });
  } else {
    await app.register(fastifyHelmet);
  }

  // console.log(configService.get<Buffer>('session.key'));

  await app.register(FastifySecureSession, {
    secret: 'averylogphrasebiggerthanthirtytwochars',
    salt: 'mq9hDxBVDbspDR6n',

    cookie: {
      maxAge: configService.get<number>('session.cookie.ttl'),
      path: '/',

      // Use httpOnly for all production purposes
      // options for setCookie, see https://github.com/fastify/fastify-cookie
      httpOnly: !isDevEnv(),

      // allow non https cookies in dev mode
      secure: !isDevEnv(),
    },
  });

  await app.register(FastifyCsrf, {
    sessionPlugin: 'fastify-secure-session',
  });

  await app.register(FastifyPassport.initialize());
  await app.register(
    FastifyPassport.secureSession({
      session: true,
    })
  );

  FastifyPassport.use(
    'local',
    new PassportLocal.Strategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, username, password, done) => {
        console.log('cb');
        done(null, {});
      }
    )
  );

  FastifyPassport.registerUserSerializer<User, string>((user) => Promise.resolve(user.id));
  FastifyPassport.registerUserDeserializer(async () => {
    return Promise.resolve({});
  });

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

function useSwagger(app: NestFastifyApplication) {
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
