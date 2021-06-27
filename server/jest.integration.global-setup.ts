/* eslint-disable @typescript-eslint/no-var-requires */
import webpack from 'webpack';
import { join } from 'path';
import chalk from 'chalk';

interface ServerEntry {
  bootstrap(): Promise<void>;
}

const configFactory = require('./webpack.config.js') as (env: Record<string, unknown>) => webpack.Configuration;

/**
 * helper for launching the full backend process
 */
module.exports = async function () {
  console.log('Compiling server bundle');

  const config = configFactory({
    prod: true,
  });
  const compiler = webpack(config);

  await new Promise<webpack.Stats>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      if (stats.hasErrors()) {
        return reject(stats.toString());
      }

      resolve(stats);
    });
  });

  const outputPath = join(config.output.path, 'server.js');
  console.log(`Launching bundle at: ${chalk.yellow(outputPath)}`);

  const module = await import(outputPath);
  const instance = (module.default as () => ServerEntry)();

  await instance.bootstrap();

  (global as any).__BACKEND_INSTANCE__ = instance;
};
