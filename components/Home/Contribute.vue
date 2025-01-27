<template>
<section class="py-16 bg-emerald-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="lg:text-center">
            <h2 class="text-3xl font-display text-gray-900 tracking-tight">{{ $t('home.contribute.title') }}</h2>
            <p class="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto font-body">
              {{ $t('home.contribute.subtitle') }}
            </p>
          </div>

          <div class="mt-12">
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Resource Contribution -->
              <div class="bg-white rounded-2xl shadow-md p-8 transition-transform duration-200 hover:-translate-y-1">
                <div class="text-emerald-600">
                  <Icon name="material-symbols:library-books-outline" class="w-8 h-8" />
                </div>
                <h3 class="mt-4 text-lg font-display text-gray-900">{{ $t('home.contribute.cards.resources.title') }}</h3>
                <p class="mt-2 text-base font-body text-gray-600">
                  {{ $t('home.contribute.cards.resources.description') }}
                </p>
              </div>

              <!-- Professional Registration -->
              <div class="bg-white rounded-2xl shadow-md p-8 transition-transform duration-200 hover:-translate-y-1">
                <div class="text-emerald-600">
                  <Icon name="material-symbols:psychology-outline" class="w-8 h-8" />
                </div>
                <h3 class="mt-4 text-xl font-display text-gray-900">{{ $t('home.contribute.cards.professional.title') }}</h3>
                <p class="mt-2 text-base font-body text-gray-600">
                  {{ $t('home.contribute.cards.professional.description') }}
                </p>
              </div>

              <!-- Community Support -->
              <div class="bg-white rounded-2xl shadow-md p-8 transition-transform duration-200 hover:-translate-y-1">
                <div class="text-emerald-600">
                  <Icon name="material-symbols:volunteer-activism-outline" class="w-8 h-8" />
                </div>
                <h3 class="mt-4 text-xl font-display text-gray-900">{{ $t('home.contribute.cards.community.title') }}</h3>
                <p class="mt-2 text-base font-body text-gray-600">
                  {{ $t('home.contribute.cards.community.description') }}

                </p>
              </div>
            </div>

            <div class="mt-12 text-center">
              <NuxtLink
                href="/dashboard"
                class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-sage-600 hover:bg-sage-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {{ $t('home.contribute.getStarted') }}
                <Icon name="material-symbols:arrow-forward" class="ml-2 w-5 h-5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
</template>