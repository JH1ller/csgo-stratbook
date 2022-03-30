#!/usr/bin/env zx

// tsc && cp -r ./src/utils/templates/ ./dist_server/utils/ && mkdir ./public/upload/

await $`tsc`;

await $`cp -r ./src/utils/templates/ ./dist_server/utils/`;

await $`mkdir ./public/upload/`;

console.log('\nBuild successful.');
