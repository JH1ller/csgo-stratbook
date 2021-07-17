// jest integration test entry
import type { Config } from '@jest/types';
import { defaults as tsjPreset } from 'ts-jest/presets';
import { pathsToModuleNameMapper } from 'ts-jest/utils';

import { compilerOptions } from './tsconfig.json';

import 'ts-jest/dist/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,

    globals: {
      'ts-jest': {
        tsconfig: '<rootDir>/tsconfig.eslint.json',
      },
    },

    collectCoverageFrom: ['!./dist/*.{js,jsx}'],

    moduleFileExtensions: ['js', 'json', 'ts'],

    rootDir: '.',
    roots: ['<rootDir>/test/'],
    testEnvironment: 'node',
    testRegex: '.integration.test.ts$',

    transform: {
      ...tsjPreset.transform,
      '^.+\\.hbs$': '<rootDir>/test/__transform__/html-loader.js',
    },

    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),

    globalSetup: './jest.integration.global-setup.ts',
    globalTeardown: './jest.integration.global-teardown.ts',
    injectGlobals: true,
  };
};
