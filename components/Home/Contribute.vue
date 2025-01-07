<template>
<section class="py-16 bg-emerald-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="lg:text-center">
            <h2 class="text-3xl font-display text-gray-900 tracking-tight">Join Our Community of Contributors</h2>
            <p class="mt-4 max-w-2xl text-xl text-gray-600 lg:mx-auto font-body">
              Help us build a stronger mental health support system in Kerala. Share your expertise, add resources, or join as a mental health professional.
            </p>
          </div>

          <div class="mt-12">
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Resource Contribution -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                <div class="text-emerald-600">
                  <Icon name="material-symbols:library-books-outline" class="w-8 h-8" />
                </div>
                <h3 class="mt-4 text-xl font-display text-gray-900">Share Resources</h3>
                <p class="mt-2 text-base font-body text-gray-600">
                  Contribute articles, guides, or educational materials in English or Malayalam.
                </p>
              </div>

              <!-- Professional Registration -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                <div class="text-emerald-600">
                  <Icon name="material-symbols:psychology-outline" class="w-8 h-8" />
                </div>
                <h3 class="mt-4 text-xl font-display text-gray-900">Join as a Professional</h3>
                <p class="mt-2 text-base font-body text-gray-600">
                  Register as a mental health professional to offer your services and expertise.
                </p>
              </div>

              <!-- Community Support -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                <div class="text-emerald-600">
                  <Icon name="material-symbols:volunteer-activism-outline" class="w-8 h-8" />
                </div>
                <h3 class="mt-4 text-xl font-display text-gray-900">Support the Community</h3>
                <p class="mt-2 text-base font-body text-gray-600">
                  Help moderate content, translate resources, or contribute to our development.
                </p>
              </div>
            </div>

            <div class="mt-12 text-center">
              <NuxtLink
                href="/dashboard"
                class="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-sage-600 hover:bg-sage-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Get Started as a Contributor
                <Icon name="material-symbols:arrow-forward" class="ml-2 w-5 h-5" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
</template>