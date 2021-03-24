import chalk from 'chalk';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      app.close().catch((err) => console.log(chalk.red(`failed to shutdown service ${err as string}`)));
    });
  }
}

bootstrap().catch((err) => console.log(chalk.red(`failed to start service ${err as string}`)));
