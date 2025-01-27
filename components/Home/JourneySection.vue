<template>
  <section class="py-16 bg-gradient-to-b from-white to-emerald-50">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-emerald-800 mb-4 text-center">{{ $t('home.journey.title') }}</h2>
      <p class="text-xl text-gray-600 mb-12 text-center">{{ $t('home.journey.subtitle') }}</p>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h3 class="font-semibold text-lg text-emerald-800 mb-3">{{ $t('home.journey.steps.firstStep.title') }}</h3>
          <p class="text-gray-600">{{ $t('home.journey.steps.firstStep.description') }}</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h3 class="font-semibold text-lg text-emerald-800 mb-3">{{ $t('home.journey.steps.concerns.title') }}</h3>
          <p class="text-gray-600">{{ $t('home.journey.steps.concerns.description') }}</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h3 class="font-semibold text-lg text-emerald-800 mb-3">{{ $t('home.journey.steps.rightHelp.title') }}</h3>
          <p class="text-gray-600">{{ $t('home.journey.steps.rightHelp.description') }}</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
          <h3 class="font-semibold text-lg text-emerald-800 mb-3">{{ $t('home.journey.steps.expectations.title') }}</h3>
          <p class="text-gray-600">{{ $t('home.journey.steps.expectations.description') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
