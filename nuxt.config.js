const pkg = require('./package');

module.exports = {
  mode: 'universal',
  env: {
    myLocale: 'zh',
  },
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ab0101' },

  /*
   ** Global CSS
   */
  css: [
    '~theme/index.css',
    { src: '~assets/styles/index.scss', lang: 'scss' },
  ],

  styleResources: {
    scss: './assets/styles/element-variables.scss',
  },

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@plugins/vue-inject.js',
    '@plugins/ctx-inject.js',
    '@plugins/element-ui',
    '@plugins/i18n',
    '@plugins/api',
    '@plugins/axios',
    { src: '@plugins/axios.client', ssr: false },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: true,
  },

  proxy: {
    '/api/common': {
      target: 'xxx',
      changeOrigin: true,
      pathRewrite: { '/api/common': '/api' },
    },
  },

  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    extractCSS: true,

    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: '~theme',
          },
        ],
      ],
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },
};
