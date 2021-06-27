// jest integration test entry
import type { Config } from '@jest/types';
import { defaults as tsjPreset } from 'ts-jest/presets';

import 'ts-jest/dist/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,

    globals: {
      'ts-jest': {
        tsconfig: {
          importHelpers: true,
        },
      },
    },

    moduleFileExtensions: ['js', 'json', 'ts'],

    rootDir: '.',
    roots: ['<rootDir>/test/'],
    testEnvironment: 'node',
    testRegex: '.integration.test.ts$',

    transform: {
      ...tsjPreset.transform,
      '^.+\\.hbs$': '<rootDir>/test/__transform__/html-loader.js',
    },

    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
    },

    globalSetup: './jest.integration.global-setup.ts',
    globalTeardown: './jest.integration.global-teardown.ts',
  };
};
