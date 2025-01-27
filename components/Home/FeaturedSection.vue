<template>
  <section class="py-16 bg-emerald-50">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-emerald-800 mb-12 text-center">{{ $t('home.featured.title') }}</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="flex items-start space-x-4">
          <Icon name="mdi:location" class="text-emerald-600 text-4xl" />
          <div>
            <h3 class="font-semibold text-lg text-emerald-800 mb-2">{{ $t('home.featured.localProfessionals.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.featured.localProfessionals.description') }}</p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="mdi:compare" class="text-emerald-600 text-4xl" />
          <div>
            <h3 class="font-semibold text-lg text-emerald-800 mb-2">{{ $t('home.featured.compareSupport.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.featured.compareSupport.description') }}</p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="mdi:rate-review" class="text-emerald-600 text-4xl" />
          <div>
            <h3 class="font-semibold text-lg text-emerald-800 mb-2">{{ $t('home.featured.reviews.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.featured.reviews.description') }}</p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="mdi:ambulance" class="text-emerald-600 text-4xl" />
          <div>
            <h3 class="font-semibold text-lg text-emerald-800 mb-2">{{ $t('home.featured.emergency.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.featured.emergency.description') }}</p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="mdi:translate" class="text-emerald-600 text-4xl" />
          <div>
            <h3 class="font-semibold text-lg text-emerald-800 mb-2">{{ $t('home.featured.bilingual.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.featured.bilingual.description') }}</p>
          </div>
        </div>

        <div class="flex items-start space-x-4">
          <Icon name="mdi:psychology" class="text-emerald-600 text-4xl" />
          <div>
            <h3 class="font-semibold text-lg text-emerald-800 mb-2">{{ $t('home.featured.guidance.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.featured.guidance.description') }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
