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
    'nuxt-auth-utils',
    '@pinia/colada-nuxt',
    '@pinia/nuxt',
    'shadcn-nuxt',
    '@nuxtjs/color-mode'
  ],
   hub: {
    blob: true,
    database: true
  },
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