<template>
  <div class="p-5">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-emerald-800 mb-6">About MindHelp.fyi</h1>
      
      <div class="prose max-w-none">
        <section class="mb-12">
          <h2 class="text-2xl font-bold text-emerald-800 mb-4">Our Mission</h2>
          <p class="text-gray-600">
            MindHelp.fyi is dedicated to making mental health support accessible to everyone in Kerala. 
            We believe that everyone deserves access to quality mental health resources and support, 
            regardless of their background or circumstances.
          </p>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-bold text-emerald-800 mb-4">What We Do</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div v-for="(service, index) in services" :key="index" class="p-6 bg-white rounded-xl border-2 border-emerald-100">
              <h3 class="text-xl font-semibold text-emerald-800 mb-3">{{ service.title }}</h3>
              <p class="text-gray-600">{{ service.description }}</p>
            </div>
          </div>
        </section>

        <section class="mb-12">
          <h2 class="text-2xl font-bold text-emerald-800 mb-4">Our Approach</h2>
          <ul class="space-y-4 text-gray-600">
            <li><strong>Local Focus:</strong> We understand the unique cultural context of Kerala and provide resources that are culturally appropriate and locally relevant.</li>
            <li><strong>Bilingual Support:</strong> All our resources are available in both Malayalam and English to ensure accessibility.</li>
            <li><strong>Professional Network:</strong> We work with qualified mental health professionals and verified support services.</li>
            <li><strong>Community-Centric:</strong> We believe in the power of community support and peer networks in mental health recovery.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-emerald-800 mb-4">Get Involved</h2>
          <p class="text-gray-600 mb-4">
            We're always looking for mental health professionals, organizations, and volunteers who want to contribute to our mission.
          </p>
          <NuxtLink to="/contact" class="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all">
            Contact Us
            <span class="material-icons ml-2">arrow_forward</span>
          </NuxtLink>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'About Us',
  description: 'Learn about MindHelp.fyi\'s mission and approach to mental health support in Kerala'
})

const services = [
  {
    title: 'Resource Directory',
    description: 'We maintain a comprehensive directory of mental health professionals and support services in Kerala.'
  },
  {
    title: 'Crisis Support',
    description: 'We provide immediate access to crisis helplines and emergency mental health services.'
  },
  {
    title: 'Educational Resources',
    description: 'We offer educational materials about mental health, wellness, and self-care strategies.'
  },
  {
    title: 'Community Support',
    description: 'We facilitate support groups and community connections for mental health support.'
  }
]
</script>
