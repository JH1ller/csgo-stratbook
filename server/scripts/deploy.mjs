#!/usr/bin/env zx

cd('../client');

if (argv.prod) {
  await $`npm run build`;
} else {
  await $`npm run build:staging`;
}

cd('../landingpage');

await $`npm run generate`;

cd('..');

await $`git add .`;
await $`git commit -m "chore: rebuild fe" || echo "No changes to commit"`;

const branchName = await $`git branch --show-current`;

await $`git push ${argv.prod ? 'prod' : 'staging'} \`git subtree split --prefix server ${branchName}\`:master --force`;

console.log('done!');
