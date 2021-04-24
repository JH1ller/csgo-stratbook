require('dotenv').config();
const execSync = require('child_process').execSync;

const generatorOptions = {
  enumNameSuffix: '',
  supportsES6: true,
  withoutPrefixEnums: true,
};

const command = `docker run --rm -v ${
  process.env.PWD
}:/local openapitools/openapi-generator-cli generate -i http://host.docker.internal:${
  process.env.DEV_API_PORT
}/swagger-json -g typescript-axios -o /local/src/api/ ${Object.entries(generatorOptions).reduce(
  (acc, [key, value]) => ((acc += ` --additional-properties=${key}=${value.toString()}`), acc),
  ''
)}`;

console.log(`Executing: ${command}`);

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.log(error);
}

process.exit(0);
