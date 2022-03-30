#!/usr/bin/env zx

cd('..');

await $`git subtree push --prefix server heroku master`;
//await $`git push heroku \`git subtree split --prefix server master\`:master --force`;

console.log('done!');
