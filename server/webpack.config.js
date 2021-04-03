const webpack = require('webpack');
const path = require('path');
const child_process = require('child_process');

const nodeExternals = require('webpack-node-externals');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function git(command) {
  return child_process.execSync(`git ${command}`, { encoding: 'utf8' }).trim();
}

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);

  // default object
  env = env || {};

  console.log('mode:', isDevBuild ? 'development' : 'production');

  return {
    mode: isDevBuild ? 'development' : 'production',

    // is this even required for server apps?
    devtool: 'source-map',

    entry: ['webpack/hot/poll?100', './src/main.ts'],
    target: 'node',

    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'server.js',
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js'],

      alias: {
        src: path.resolve(__dirname, './src'),
        'tslib$': 'tslib/tslib.es6.js',
      },

      modules: ['node_modules'],
    },

    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100', 'tslib'],
      }),
    ],

    module: {
      rules: [
        {
          test: /.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },

    optimization: {
      // don't minimize in production deployments
      minimize: false,
    },

    plugins: [
      // manually provide ts-imports to webpack
      new webpack.ProvidePlugin({
        '__assign': ['tslib', '__assign'],
        '__extends': ['tslib', '__extends'],
        '__rest': ['tslib', '__rest'],
        '__decorate': ['tslib', '__decorate'],
        '__param': ['tslib', '__param'],
        '__metadata': ['tslib', '__metadata'],
        '__awaiter': ['tslib', '__awaiter'],
        '__generator': ['tslib', '__generator'],
        '__createBinding': ['tslib', '__createBinding'],
        '__exportStar': ['tslib', '__exportStar'],
        '__values': ['tslib', '__values'],
        '__read': ['tslib', '__read'],
        '__spread': ['tslib', '__spread'],
        '__spreadArrays': ['tslib', '__spreadArrays'],
        '__spreadArray': ['tslib', '__spreadArray'],
        '__await': ['tslib', '__await'],
        '__asyncGenerator': ['tslib', '__asyncGenerator'],
        '__asyncDelegator': ['tslib', '__asyncDelegator'],
        '__asyncValues': ['tslib', '__asyncValues'],
        '__makeTemplateObject': ['tslib', '__makeTemplateObject'],
        '__importStar': ['tslib', '__importStar'],
        '__importDefault': ['tslib', '__importDefault'],
        '__setModuleDefault': ['tslib', '__setModuleDefault'],
        '__classPrivateFieldGet': ['tslib', '__classPrivateFieldGet'],
        '__classPrivateFieldSet': ['tslib', '__classPrivateFieldSet'],
      }),

      new webpack.EnvironmentPlugin({
        BUILD_TIME: JSON.stringify(new Date().toLocaleString()),

        GIT_VERSION: git('describe --always'),
        GIT_AUTHOR_DATE: git('log -1 --format=%aI'),
      }),

      new CaseSensitivePathsPlugin(),

      new webpack.HotModuleReplacementPlugin(),
      new RunScriptWebpackPlugin({ name: 'server.js' }),

      new CleanWebpackPlugin({
        verbose: true,
        cleanStaleWebpackAssets: false,
        cleanOnceBeforeBuildPatterns: [path.join(__dirname, './dist')],
      }),
    ],
  };
};
