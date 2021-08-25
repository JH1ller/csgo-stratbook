// generate swagger docs for integration testing

import { cwd } from 'process';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) {
  throw new Error('Port undefined, .env missing?');
}

const generatorOptions = {
  enumNameSuffix: '',

  useSingleRequestParameter: true,
  supportsES6: true,

  enumPropertyNaming: 'original',
  // withSeparateModelsAndApi: true,

  // apiPackage: 'apis',
  // modelPackage: 'models',
};

const command =
  `docker run --rm -v ${cwd()}:/local openapitools/openapi-generator-cli generate -i ` +
  `http://host.docker.internal:${process.env.PORT}/swagger-json -g typescript-axios ` +
  '-o /local/test/api/ ' +
  Object.entries(generatorOptions).reduce(
    (acc, [key, value]) => (acc += ` --additional-properties=${key}=${value.toString()}`),
    ''
  );

console.log(`Executing: ${command}`);

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.log(error);
}

process.exit(0);
