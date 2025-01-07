<template>
  <div class="min-h-screen bg-gradient-to-b from-emerald-50 to-white">

    
    <main class="">
      <!-- Hero Section -->
      <section class="container mx-auto px-4 py-16">
        <div class="max-w-4xl mx-auto text-center mb-12">
      
          <HomeHeroSection/>
          <HomeSearchSupport class="mt-8" />
        </div>
      </section>

      <!-- Main Navigation Cards -->
      <section class="py-8">
        <HomeMainNavigation />
      </section>

      <!-- Featured Section -->
      <HomeFeaturedSection />

      <!-- Resource Finder -->
      <HomeResourceFinder />

      <!-- Journey Section -->
      <HomeJourneySection />

      <!-- Trust Indicators -->
      <HomeTrustIndicators />

      <!-- Contribute Section  -->
      <HomeContribute />
    </main>


  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'MindHelp.fyi - Mental Health Support in Kerala',
  meta: [
    {
      name: 'description',
      content: 'Find mental health support in Kerala. Connect with local professionals, access bilingual resources, and get guided support for your mental well-being journey.'
    }
  ],
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manjari:wght@400;700&display=swap'
    }
  ]
})
</script>

<style>
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-malayalam: 'Manjari', sans-serif;
}

body {
  font-family: var(--font-sans);
}

.font-malayalam {
  font-family: var(--font-malayalam);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>