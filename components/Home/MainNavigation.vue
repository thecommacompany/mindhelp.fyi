<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
    <!-- Emergency Card -->
    <div class="bg-red-50 rounded-xl p-6 hover:shadow-lg transition-all group">
      <h3 class="text-xl font-semibold text-red-800 mb-3">{{ $t('home.mainNav.emergency.title') }}</h3>
      <p class="text-gray-600 mb-4">{{ $t('home.mainNav.emergency.description') }}</p>
      <NuxtLink 
        to="/emergency"
        class="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors group-hover:shadow-md"
      >
        {{ $t('home.mainNav.emergency.cta') }}
        <span class="material-icons ml-2">emergency</span>
      </NuxtLink>
    </div>

    <!-- Professional Help Card -->
    <div class="bg-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all group">
      <h3 class="text-xl font-semibold text-emerald-800 mb-3">{{ $t('home.mainNav.professional.title') }}</h3>
      <p class="text-gray-600 mb-4">{{ $t('home.mainNav.professional.description') }}</p>
      <NuxtLink 
        to="/find-help"
        class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors group-hover:shadow-md"
      >
        {{ $t('home.mainNav.professional.cta') }}
        <span class="material-icons ml-2">person_search</span>
      </NuxtLink>
    </div>

    <!-- Understanding Mental Health Card -->
    <div class="bg-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all group">
      <h3 class="text-xl font-semibold text-emerald-800 mb-3">{{ $t('home.mainNav.mentalHealth.title') }}</h3>
      <p class="text-gray-600 mb-4">{{ $t('home.mainNav.mentalHealth.description') }}</p>
      <NuxtLink 
        to="/learn"
        class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors group-hover:shadow-md"
      >
        {{ $t('home.mainNav.mentalHealth.cta') }}
        <span class="material-icons ml-2">school</span>
      </NuxtLink>
    </div>

    <!-- Supporting Someone Card -->
    <div class="bg-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all group">
      <h3 class="text-xl font-semibold text-emerald-800 mb-3">{{ $t('home.mainNav.support.title') }}</h3>
      <p class="text-gray-600 mb-4">{{ $t('home.mainNav.support.description') }}</p>
      <NuxtLink 
        to="/support-guide"
        class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors group-hover:shadow-md"
      >
        {{ $t('home.mainNav.support.cta') }}
        <span class="material-icons ml-2">favorite</span>
      </NuxtLink>
    </div>
  </div>
</template>
