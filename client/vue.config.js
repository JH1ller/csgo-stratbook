module.exports = {
  publicPath: '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/styles/index.scss";`
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Hiller Website Tools",
        appId: "Hiller.Tools",
        win: {
          target: "portable",
          publisherName: 'Hiller',
          icon: './icon.png'
        },
        portable: {
          artifactName: "HillerWebsiteTool.exe"
        },
        directories: {
          output: "dist_electron/release"
        }
      }
    }
  },

}