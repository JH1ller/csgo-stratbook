const path = require('path');

const electronConfig = {
  target: 'electron-renderer',
};

module.exports = {
  publicPath: '/',
  outputDir: path.resolve(__dirname, '../server/dist_app'),
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/index.scss";`,
      },
    },
  },
  configureWebpack: process.env.BUILD_TARGET === 'ELECTRON' ? electronConfig : {},
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
          publish: {
            provider: 's3',
            bucket: process.env.S3_BUCKET_NAME,
          },
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
      },
    },
  },
};
