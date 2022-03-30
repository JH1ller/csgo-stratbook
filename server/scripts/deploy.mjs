#!/usr/bin/env zx

cd('../client');

await $`npm run build:staging`;
await $`git add .`;
await $`git commit -m "chore: rebuild fe"`;

cd('..');

await $`git subtree push --prefix server heroku master`;
//await $`git push heroku \`git subtree split --prefix server master\`:master --force`;

console.log('done!');
