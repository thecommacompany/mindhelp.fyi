<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
    <!-- Emergency Card -->
    <div class="bg-red-50 rounded-xl p-6 hover:shadow-lg transition-all group">
      <h3 class="text-xl font-semibold text-red-800 mb-3">Need Immediate Help?</h3>
      <p class="text-gray-600 mb-4">Get immediate support and crisis resources</p>
      <NuxtLink 
        to="/emergency"
        class="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors group-hover:shadow-md"
      >
        Emergency Contact
        <span class="material-icons ml-2">emergency</span>
      </NuxtLink>
    </div>

    <!-- Professional Help Card -->
    <div class="bg-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all group">
      <h3 class="text-xl font-semibold text-emerald-800 mb-3">Talk to a Professional</h3>
      <p class="text-gray-600 mb-4">Find verified therapists, counselors, and psychiatrists near you</p>
      <NuxtLink 
        to="/find-help"
        class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors group-hover:shadow-md"
      >
        Find Help
        <span class="material-icons ml-2">person_search</span>
      </NuxtLink>
    </div>

    <!-- Understanding Mental Health Card -->
    <div class="bg-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all group">
      <h3 class="text-xl font-semibold text-emerald-800 mb-3">Understanding Mental Health</h3>
      <p class="text-gray-600 mb-4">Learn about different conditions and treatment options</p>
      <NuxtLink 
        to="/learn"
        class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors group-hover:shadow-md"
      >
        Learn More
        <span class="material-icons ml-2">school</span>
      </NuxtLink>
    </div>

    <!-- Supporting Someone Card -->
    <div class="bg-emerald-50 rounded-xl p-6 hover:shadow-lg transition-all group">
      <h3 class="text-xl font-semibold text-emerald-800 mb-3">Supporting Someone?</h3>
      <p class="text-gray-600 mb-4">Resources for friends and family members</p>
      <NuxtLink 
        to="/support-guide"
        class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors group-hover:shadow-md"
      >
        Guide for Supporters
        <span class="material-icons ml-2">favorite</span>
      </NuxtLink>
    </div>
  </div>
</template>
