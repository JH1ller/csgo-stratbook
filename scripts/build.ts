import 'zx/globals';

cd('./landingpage');

await $`npm ci`;
await $`npm run generate`;

cd('../client');

await $`npm run build`;
