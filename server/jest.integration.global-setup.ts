/* eslint-disable @typescript-eslint/no-var-requires */
import webpack from 'webpack';
import { join } from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { Socket } from 'net';

// import dotenv config
dotenv.config();

interface ServerEntry {
  bootstrap(): Promise<void>;
}

const configFactory = require('./webpack.config.js') as (env: Record<string, unknown>) => webpack.Configuration;

/**
 * helper for launching the full backend process
 */
module.exports = async function () {
  // test if we can reuse an already running dev server
  if (await testPort(Number.parseInt(process.env.PORT, 10))) {
    return;
  }

  console.log('Compiling server bundle');

  const config = configFactory({
    prod: true,
    instrumentCode: true,
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

/**
 * Test if our backend is already running in a detached process
 * @param port port to test connect to
 * @returns Promise which indicates if a service is running on the specified port
 */
async function testPort(port: number) {
  const client = new Socket();

  const result = await new Promise<boolean>((resolve) => {
    client.once('connect', () => {
      // port is in use
      return resolve(true);
    });

    client.once('error', () => {
      return resolve(false);
    });

    client.connect({
      port,
      host: '127.0.0.1',
    });
  });

  // destroy client
  await new Promise<void>((resolve) => {
    // see: https://github.com/stdarg/tcp-port-used/blob/master/index.js#L100
    client.removeAllListeners('connect');
    client.removeAllListeners('error');

    client.end(() => {
      client.destroy();

      resolve();
    });
  });

  return result;
}
