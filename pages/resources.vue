<template>
  <div class="p-5">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-4xl font-bold text-emerald-800 mb-6">Mental Health Resources</h1>
      <p class="text-xl text-gray-600 mb-8">Access a comprehensive collection of mental health resources and support materials.</p>

      <div class="grid gap-12">
        <section id="counseling">
          <h2 class="text-2xl font-bold text-emerald-800 mb-6">Professional Support</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(resource, index) in professionalResources" :key="index" 
                 class="p-6 bg-white rounded-xl border-2 border-emerald-100 hover:border-emerald-300 transition-all">
              <h3 class="text-xl font-semibold text-emerald-800 mb-3">{{ resource.title }}</h3>
              <p class="text-gray-600 mb-4">{{ resource.description }}</p>
              <div class="space-y-2">
                <div v-if="resource.contact" class="text-sm text-gray-500">
                  Contact: {{ resource.contact }}
                </div>
                <div v-if="resource.location" class="text-sm text-gray-500">
                  Location: {{ resource.location }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="groups">
          <h2 class="text-2xl font-bold text-emerald-800 mb-6">Support Groups</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(group, index) in supportGroups" :key="index" 
                 class="p-6 bg-white rounded-xl border-2 border-emerald-100 hover:border-emerald-300 transition-all">
              <h3 class="text-xl font-semibold text-emerald-800 mb-3">{{ group.name }}</h3>
              <p class="text-gray-600 mb-4">{{ group.description }}</p>
              <div class="space-y-2">
                <div class="text-sm text-gray-500">Schedule: {{ group.schedule }}</div>
                <div class="text-sm text-gray-500">Language: {{ group.language }}</div>
              </div>
            </div>
          </div>
        </section>

        <section id="wellness">
          <h2 class="text-2xl font-bold text-emerald-800 mb-6">Wellness Resources</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(resource, index) in wellnessResources" :key="index" 
                 class="p-6 bg-white rounded-xl border-2 border-emerald-100 hover:border-emerald-300 transition-all">
              <h3 class="text-xl font-semibold text-emerald-800 mb-3">{{ resource.title }}</h3>
              <p class="text-gray-600 mb-4">{{ resource.description }}</p>
              <NuxtLink :to="resource.link" class="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center">
                Learn more
                <span class="material-icons ml-1 text-sm">arrow_forward</span>
              </NuxtLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Resources',
  description: 'Mental health resources and support materials in Kerala'
})

const professionalResources = [
  {
    title: 'Mental Health Clinic',
    description: 'Professional counseling and therapy services.',
    contact: '+91 484-123-4567',
    location: 'Ernakulam'
  },
  {
    title: 'Wellness Center',
    description: 'Holistic mental health care and support.',
    contact: '+91 471-987-6543',
    location: 'Thiruvananthapuram'
  },
  {
    title: 'Family Counseling Center',
    description: 'Specialized family therapy and relationship counseling.',
    contact: '+91 495-234-5678',
    location: 'Kozhikode'
  }
]

const supportGroups = [
  {
    name: 'Anxiety Support Group',
    description: 'A safe space to share experiences and coping strategies for anxiety.',
    schedule: 'Every Tuesday, 6 PM',
    language: 'Malayalam & English'
  },
  {
    name: 'Youth Mental Health Circle',
    description: 'Support group focused on young adults mental well-being.',
    schedule: 'Every Saturday, 4 PM',
    language: 'Malayalam & English'
  },
  {
    name: 'Family Support Network',
    description: 'Support group for families of individuals with mental health challenges.',
    schedule: 'First Sunday of every month, 10 AM',
    language: 'Malayalam'
  }
]

const wellnessResources = [
  {
    title: 'Meditation Guide',
    description: 'Learn meditation techniques for mental wellness.',
    link: '/learn#meditation'
  },
  {
    title: 'Stress Management',
    description: 'Practical tools and techniques for managing stress.',
    link: '/learn#stress'
  },
  {
    title: 'Self-Care Resources',
    description: 'Guide to developing healthy self-care practices.',
    link: '/learn#self-care'
  }
]
</script>
