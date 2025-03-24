// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  css: ['~/assets/scss/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/scss/variables.scss";',
        },
      },
    },
  },

  app: {
    head: {
      title: 'Login Portal',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3000',
    },
  },

  compatibilityDate: '2025-03-25',
})
