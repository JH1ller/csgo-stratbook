module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:unicorn/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['!./src/**/*.ts', '.eslintrc.js', 'scripts', 'client-build'],
  plugins: ['@typescript-eslint', 'unicorn', 'simple-import-sort'],
  rules: {
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-null': 'off',
    'unicorn/filename-case': 'off',
    '@typescript-eslint/no-unnecessary-condition': ['warn', { allowConstantLoopConditions: true }],
  },
};
