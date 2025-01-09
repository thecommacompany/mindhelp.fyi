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
    },
    session: {
      name: 'nuxt-session',
      password: process.env.NUXT_SESSION_PASSWORD || '',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      cookie: {
        sameSite: 'lax'
      }
    }
  }
})