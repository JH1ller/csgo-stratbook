import * as chalk from 'chalk';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { fastifyHelmet } from 'fastify-helmet';

import { AppModule } from './app.module';
import { isDevEnv } from './utils/env';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: isDevEnv(),
    })
  );

  const configService = app.get(ConfigService);

  if (isDevEnv()) {
    // we need to disable CSP for swagger in development mode
    await app.register(fastifyHelmet, {
      contentSecurityPolicy: false,
    });
  } else {
    await app.register(fastifyHelmet);
  }

  // set all routes to /api/<controller_name>
  app.setGlobalPrefix('api');

  app.enableCors({
    credentials: true,
    origin: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
    })
  );

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
