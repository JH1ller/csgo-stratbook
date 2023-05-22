const path = require('path');

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',
  server: {
    port: 4000,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Stratbook',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Free web app to manage counterstrike strats and nades for your team. Always synced with your teammates, and works great on mobile.',
      },
      { hid: 'author', name: 'author', content: 'Justin Hiller' },
      {
        hid: 'keywords',
        name: 'keywords',
        content:
          'stratbook, strategies, strategy, tactics, playbook, tool, esport, csgo, counter-strike, counterstrike, global offensive, cs:go, free, database, manage',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/png',
        href: '/favicon.png',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&family=Ubuntu:wght@300;400;500;700&display=swap',
      },
      {
        rel: 'canonical',
        href: 'https://stratbook.pro/',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/styles/core.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/tippy'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    [
      '@nuxtjs/fontawesome',
      {
        component: 'FaIcon',
        addCss: false,
        suffix: false,
        icons: {
          brands: ['faTwitter', 'faGithub', 'faDiscord'],
          solid: ['faAngleDown', 'faTimes'],
        },
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'nuxt-i18n',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  styleResources: {
    scss: ['@/styles/index.scss'],
  },

  i18n: {
    seo: true,
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        file: 'en-US.js',
        iso: 'en-US',
      },
      {
        code: 'de',
        file: 'de-DE.js',
        iso: 'de-DE',
      },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      onlyOnRoot: true,
      alwaysRedirect: true,
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  buildDir: 'build/',
  generate: {
    dir: path.resolve(__dirname, '../server/dist_landingpage'),
  },
};
