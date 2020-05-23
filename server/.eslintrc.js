module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:security/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {},
  plugins: ['security'],
};
