module.exports = {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + 'Disease Tracker',
    title: ' Disease tracker - Get news, alerts and medical help instantly.',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Disease Tracker help you throught alerts, news and medical assistance online. Get alerts about COVID-19 and send alerts. Get to know dangerous places near from you.'
      }
    ],

    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/leaflet@1.2.0/dist/leaflet.css'
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap'
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css'
      }
    ]
  },

  loading: { color: '#fff' },

  css: [],

  plugins: [
    { src: '~/plugins/localstorage.js', ssr: false },
    { src: '~/plugins/axios.js', ssr: false }
  ],

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify'
  ],

  modules: [
    ['@nuxtjs/axios'],
    ['@nuxtjs/pwa'],
    // Doc: https://github.com/nuxt-community/dotenv-module
    ['@nuxtjs/dotenv', { filename: '.env' }],
    ['nuxt-leaflet']
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: 'http://localhost:8080'
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */

  build: {
    extend(config, ctx) {}
  }
}
