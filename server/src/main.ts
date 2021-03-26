import chalk from 'chalk';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as helmet from 'helmet';

import { AppModule } from './app.module';

import { isDevEnv } from './utils/env';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: isDevEnv(),
    })
  );

  // set all routes to /api/<controller_name>
  app.setGlobalPrefix('api');

  app.enableCors({
    credentials: true,
    origin: true,
  });

  // setup handlers
  app.use(helmet());

  if (isDevEnv()) {
    useSwagger(app);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`listening on port ${port}`);

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
  const config = new DocumentBuilder()
    .setTitle('csgo-stratbook api')
    .setDescription('Stratbook REST API')
    .setVersion('0.1')
    .addTag('stratbook')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

bootstrap() // bootstrap application
  .catch((err) => console.log(chalk.red(`failed to start service ${err as string}`)));
