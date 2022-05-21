module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parser: 'vue-eslint-parser',
  // parserOptions: {
  //   ecmaVersion: 2020,
  // },
  plugins: ['prettier', '@typescript-eslint'],
  extends: ['plugin:vue/base', 'plugin:vue/essential', 'eslint:recommended', '@vue/typescript/recommended'],
  rules: {
    //'@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-case-declarations': 'off',
    'no-debugger': 'off',
  },
};
