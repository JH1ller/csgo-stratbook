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

module.exports = {
  devServer: {
    allowedHosts: 'all',
  },
  publicPath: '/',
  outputDir: path.resolve(__dirname, '../server/dist_app'),
  pages: {
    index: 'src/main.ts',
    loader: 'src/loader.ts',
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/index.scss";`,
      },
    },
  },
  parallel: 4,
  configureWebpack: (config) => {
    if (process.env.BUILD_TARGET === 'ELECTRON') {
      config.target = 'electron-renderer';
    }
    config.devtool = process.env.NODE_ENV !== 'production' ? 'eval-source-map' : false;
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
        tls: false,
        net: false,
        path: false,
        zlib: false,
        http: false,
        https: false,
        stream: false,
        crypto: false,
        os: false,
        util: false,
        assert: false,
      },
    };
  },
  transpileDependencies: ['replace-keywords'],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: 'Stratbook',
        appId: 'live.stratbook',
        win: {
          target: 'nsis',
          //publisherName: 'Hiller',
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
