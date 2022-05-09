#!/usr/bin/env zx

cd('../client');

await $`npm run build:staging`;

cd('..');

await $`git add .`;
await $`git commit -m "chore: rebuild fe" || echo "No changes to commit"`;

const branchName = await $`git branch --show-current`;

await $`git push heroku \`git subtree split --prefix server ${branchName}\`:master --force`;

console.log('done!');
