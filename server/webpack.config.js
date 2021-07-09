const chalk = require('chalk');
const webpack = require('webpack');
const path = require('path');
const child_process = require('child_process');

const NodeExternals = require('webpack-node-externals');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const WebpackWatchSandboxPlugin = require('./webpack-watch-sandbox');

function git(command) {
  return child_process.execSync(`git ${command}`, { encoding: 'utf8' }).trim();
}

/**
 * @param {Record<string, unknown>} env
 * @returns {webpack.Configuration}
 */
module.exports = (env) => {
  // default object
  env = env || {};

  const isDevBuild = !env.prod;
  const isStandalone = !!env.standalone;

  console.log(chalk.green('mode:', isDevBuild ? 'development' : 'production'));

  if (isStandalone) {
    console.log(chalk.yellow('standalone build'));
  }

  return {
    mode: isDevBuild ? 'development' : 'production',

    // is this even required for server apps?
    devtool: 'source-map',

    entry: {
      server: isDevBuild ? ['webpack/hot/poll?100', './src/main.ts'] : './src/main.ts',
      'image-processor': './src-processors/image-processor.ts',
    },

    target: 'node15.12',

    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      clean: true,
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js'],

      alias: {
        src: path.resolve(__dirname, './src'),
        tslib$: 'tslib/tslib.es6.js',
      },

      modules: ['node_modules'],
    },

    externals: [
      NodeExternals({
        allowlist: ['webpack/hot/poll?100', 'tslib', /^lodash-es/],
      }),
    ],

    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
    },

    module: {
      rules: [
        {
          test: /.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            // disable type checker - we will use it in fork plugin
            transpileOnly: true,
          },
        },
        {
          test: /\.hbs$/i,
          loader: 'html-loader',
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                implementation: require('sass'),
                sassOptions: {
                  fiber: false,
                },
              },
            },
          ],
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
        __assign: ['tslib', '__assign'],
        __extends: ['tslib', '__extends'],
        __rest: ['tslib', '__rest'],
        __decorate: ['tslib', '__decorate'],
        __param: ['tslib', '__param'],
        __metadata: ['tslib', '__metadata'],
        __awaiter: ['tslib', '__awaiter'],
        __generator: ['tslib', '__generator'],
        __createBinding: ['tslib', '__createBinding'],
        __exportStar: ['tslib', '__exportStar'],
        __values: ['tslib', '__values'],
        __read: ['tslib', '__read'],
        __spread: ['tslib', '__spread'],
        __spreadArrays: ['tslib', '__spreadArrays'],
        __spreadArray: ['tslib', '__spreadArray'],
        __await: ['tslib', '__await'],
        __asyncGenerator: ['tslib', '__asyncGenerator'],
        __asyncDelegator: ['tslib', '__asyncDelegator'],
        __asyncValues: ['tslib', '__asyncValues'],
        __makeTemplateObject: ['tslib', '__makeTemplateObject'],
        __importStar: ['tslib', '__importStar'],
        __importDefault: ['tslib', '__importDefault'],
        __setModuleDefault: ['tslib', '__setModuleDefault'],
        __classPrivateFieldGet: ['tslib', '__classPrivateFieldGet'],
        __classPrivateFieldSet: ['tslib', '__classPrivateFieldSet'],
      }),

      new webpack.EnvironmentPlugin({
        BUILD_TIME: new Date().toLocaleString(),

        GIT_VERSION: git('describe --always'),
        GIT_AUTHOR_DATE: git('log -1 --format=%aI'),
      }),

      new CaseSensitivePathsPlugin(),
      new ForkTsCheckerWebpackPlugin({
        eslint: {
          // required - same as command `eslint ./src/**/*.{ts,tsx,js,jsx} --ext .ts,.tsx,.js,.jsx`
          files: [
            './src/**/*.{ts,tsx,js,jsx}',
            './src-processors/**/*.{ts,tsx,js,jsx}',
          ],
        },
      }),

      new webpack.WatchIgnorePlugin({
        paths: [
          path.resolve(__dirname, './public'),
          path.resolve(__dirname, './dist'),
          path.resolve(__dirname, './test'),
        ],
      }),
    ]
      .concat(
        isDevBuild
          ? [
              // hot reload specific plugins
              new webpack.HotModuleReplacementPlugin(),

              // used to disable auto watcher in jest
              new WebpackWatchSandboxPlugin({
                name: 'server.js',
              }),
            ]
          : []
      )
      .concat(
        isStandalone
          ? [
              new webpack.EnvironmentPlugin({
                STANDALONE_BUILD: JSON.stringify(isStandalone),
              }),
            ]
          : []
      ),
  };
};
