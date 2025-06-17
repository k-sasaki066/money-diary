// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  ssr: false,

  app: {
    head: {
      title: 'MyMoney',
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://unpkg.com/sakura.css/css/sakura-earthly.css'
        },
      ],
      script: [
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js', defer: true
        },
        {
          src: '/indexedDB.js',
          defer: true
        },
        {
          src: '/graph.js',
          defer: true
        },
        {
          src: '/inputCheck.js',
          defer: true
        },
      ],
    }
  },
  plugins: [
    '~/plugins/firebase.client.ts',
    '~/plugins/axios.client.ts',
  ],
  runtimeConfig: {
    public: {
      FIREBASE_API_KEY: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      PUSHER_APP_KEY: process.env.NUXT_PUBLIC_PUSHER_APP_KEY,
      PUSHER_APP_CLUSTER: process.env.NUXT_PUBLIC_PUSHER_APP_CLUSTER,
    }
  },
  modules: ['@pinia/nuxt'],
});

