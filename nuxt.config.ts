// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxthub/core',
    '@nuxtjs/tailwindcss',
    'nuxt-icon-tw',
    'nuxt-headlessui',
    '@nuxt/content',
    'nuxt-auth-utils'
  ],
  runtimeConfig: {
    oauth:{
      google: {
        clientId: '...',
        clientSecret: '...',
        redirectURL: '...'
      }
    }
  }
})