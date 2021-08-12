const path = require('path');

function getPublishConfig() {
  return process.env.PUBLISHTO === 'prod'
    ? {
        provider: 's3',
        bucket: process.env.S3_BUCKET_NAME,
      }
    : {
        provider: 's3',
        endpoint: 'http://127.0.0.1:9000',
        bucket: 'test-update',
      };
}

/**
 *
 * @param {import('webpack-chain')} config
 */
function clientChain(config) {
  config.resolve.alias.set('src', path.resolve(__dirname, './src'));

  config.target(process.env.BUILD_TARGET === 'ELECTRON' ? 'electron-renderer' : 'web');
  config.stats('verbose');
  config.devtool(process.env.NODE_ENV === 'production' ? 'source-map' : 'eval');
}

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  publicPath: '/',
  outputDir: path.resolve(__dirname, '../server/dist_app'),

  pages: {
    index: 'src/main.ts',
    loader: 'src/loader.ts',
  },

  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "@/styles/index.scss";',
      },
    },
  },

  chainWebpack: clientChain,

  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,

      preload: path.join(__dirname, 'src-electron/main-process/electron-preload.ts'),

      mainProcessFile:
        process.env.NODE_ENV !== 'production'
          ? 'src-electron/main-process/electron-main.dev.ts'
          : 'src-electron/main-process/electron-main.ts',

      rendererProcessFile: 'src/main.ts',

      /**
       *
       * @param {import('webpack-chain')} config
       */
      chainWebpackMainProcess: (config) => {
        config.resolve.alias
          .set('src', path.resolve(__dirname, './src'))
          .set('src-electron', path.resolve(__dirname, './src-electron'));

        // config.plugin('ts-checker').use(ForkTsCheckerWebpackPlugin, [
        //   {
        //     eslint: true,
        //     reportFiles: './src-electron/**/*.{ts,tsx,js}',
        //   },
        // ]);
      },

      chainWebpackRendererProcess: clientChain,

      builderOptions: {
        productName: 'Stratbook',
        appId: 'live.stratbook',
        win: {
          target: 'nsis',
          // publisherName: 'Hiller',
          icon: './icon.png',
          // publish: {
          //   provider: 'github',
          //   token: process.env.GH_TOKEN,
          // },
          publish: getPublishConfig(),
        },
        portable: {
          artifactName: 'Stratbook.exe',
        },
        directories: {
          output: 'dist_electron/release',
        },
        protocols: {
          name: 'csgostratbook-protocol',
          schemes: ['csgostratbook'],
        },
        extraResources: ['build/*'],
      },
    },
  },
};
