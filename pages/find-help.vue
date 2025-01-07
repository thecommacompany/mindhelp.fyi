<template>
  <div class="p-5">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-emerald-800 mb-6">Find Help</h1>
      <p class="text-xl text-gray-600 mb-8">Connect with mental health professionals and support services in Kerala.</p>
      
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(service, index) in supportServices" :key="index" class="p-6 border-2 border-emerald-100 rounded-xl hover:border-emerald-300 transition-all">
          <h3 class="text-xl font-semibold text-emerald-800 mb-3">{{ service.title }}</h3>
          <p class="text-gray-600 mb-4">{{ service.description }}</p>
          <NuxtLink :to="service.link" class="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center">
            Learn more
            <span class="material-icons ml-1 text-sm">arrow_forward</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Find Help',
  description: 'Find mental health support and resources in Kerala'
})

const supportServices = [
  {
    title: 'Professional Counseling',
    description: 'Connect with licensed counselors and therapists for one-on-one support.',
    link: '/resources#counseling'
  },
  {
    title: 'Support Groups',
    description: 'Join community support groups and share experiences in a safe space.',
    link: '/resources#groups'
  },
  {
    title: 'Crisis Support',
    description: '24/7 crisis helplines and emergency mental health services.',
    link: '/emergency'
  },
  {
    title: 'Youth Services',
    description: 'Specialized support for young people dealing with mental health challenges.',
    link: '/resources#youth'
  },
  {
    title: 'Family Support',
    description: 'Resources for families supporting loved ones with mental health needs.',
    link: '/support-guide'
  },
  {
    title: 'Wellness Programs',
    description: 'Holistic programs focusing on mental wellness and prevention.',
    link: '/resources#wellness'
  }
]
</script>
