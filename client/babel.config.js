/* eslint-env node */
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@vue/babel-preset-jsx',
      {
        compositionAPI: true,
      },
    ],
  ],
};
