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
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n'
  ],
  i18n: {
    strategy: 'no_prefix',
    locales: [
      {
        code: 'en',
        file: 'en.ts',
      },
      {
        code: 'ml',
        file: 'ml.ts',
      },
    ],
    lazy: true,
    defaultLocale: 'en',
  },
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