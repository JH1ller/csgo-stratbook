const path = require('path');

module.exports = {
  devServer: {
    allowedHosts: 'all',
  },
  publicPath: '/',
  outputDir: path.resolve(__dirname, '../server/client-build/app'),
  pages: {
    index: 'src/main.ts',
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
};
