const webpack = require('webpack');
const path = require('path');

const nodeExternals = require('webpack-node-externals');
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");

const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env) => {
  const isDevBuild = !(env && env.prod);

  // default object
  env = env || {};

  console.log("mode:", isDevBuild ? "development" : "production");

  return {
    mode: isDevBuild ? "development" : "production",

    // is this even required for server apps?
    devtool: "source-map",

    entry: ['webpack/hot/poll?100', './src/main.ts'],
    target: 'node',

    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'server.js',
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.js'],

      alias: {
        "src": path.resolve(__dirname, "./src"),
      },

      modules: [
        "node_modules",
      ],
    },

    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
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
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: isDevBuild ? '"development"' : '"production"',
          BUILD_TIME: JSON.stringify(new Date().toLocaleString()),
        },
      }),

      new CaseSensitivePathsPlugin(),

      new webpack.HotModuleReplacementPlugin(),
      new RunScriptWebpackPlugin({ name: 'server.js' }),

      new CleanWebpackPlugin({
        verbose: true,
        cleanStaleWebpackAssets: false,
        cleanOnceBeforeBuildPatterns: [
          path.join(__dirname, "./dist"),
        ],
      }),
    ],
  };
}
