#!/usr/bin/env zx

await $`tsc`;

await $`cp -r ./src/utils/templates/ ./dist_server/utils/`;

console.log('\nBuild successful.');
