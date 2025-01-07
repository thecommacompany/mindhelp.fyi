<template>
  <div class="p-5">
    <div class="max-w-4xl mx-auto">
      <div class="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
        <h1 class="text-3xl font-bold text-red-800 mb-4">Emergency Mental Health Support</h1>
        <p class="text-red-700 text-lg mb-4">If you or someone else is in immediate danger or having thoughts of suicide, please get help immediately:</p>
        <div class="space-y-4">
          <div class="bg-white p-4 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-800">Emergency: 112</div>
            <p class="text-red-600">For immediate emergency response</p>
          </div>
          <div class="bg-white p-4 rounded-lg border border-red-200">
            <div class="text-2xl font-bold text-red-800">DISHA: 1056</div>
            <p class="text-red-600">24/7 Kerala helpline for mental health support</p>
          </div>
        </div>
      </div>

      <div class="space-y-8">
        <section>
          <h2 class="text-2xl font-bold text-emerald-800 mb-4">Crisis Helplines</h2>
          <div class="grid md:grid-cols-2 gap-6">
            <div v-for="(helpline, index) in helplines" :key="index" class="p-4 bg-white rounded-lg border-2 border-emerald-100">
              <h3 class="font-semibold text-emerald-800">{{ helpline.name }}</h3>
              <p class="text-gray-600 mb-2">{{ helpline.description }}</p>
              <div class="font-medium text-emerald-700">{{ helpline.number }}</div>
              <div class="text-sm text-gray-500">{{ helpline.hours }}</div>
            </div>
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold text-emerald-800 mb-4">What to Expect</h2>
          <div class="prose max-w-none text-gray-600">
            <p>When you call a crisis helpline:</p>
            <ul>
              <li>You'll speak with a trained mental health professional</li>
              <li>The conversation is completely confidential</li>
              <li>They will listen without judgment and offer support</li>
              <li>They can connect you with local resources and services</li>
              <li>Available in Malayalam and English</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Emergency Support',
  description: 'Immediate mental health crisis support and emergency resources in Kerala'
})

const helplines = [
  {
    name: 'Maithri Suicide Prevention',
    description: 'Emotional support and suicide prevention',
    number: '0484-2540530',
    hours: 'Available 24/7'
  },
  {
    name: 'Thanal Crisis Center',
    description: 'Crisis intervention and counseling',
    number: '0495-2760000',
    hours: '9 AM - 5 PM (Mon-Sat)'
  },
  {
    name: 'NIMHANS',
    description: 'Professional mental health support',
    number: '080-46110007',
    hours: 'Available 24/7'
  },
  {
    name: 'Kerala Mental Health Support',
    description: 'Local mental health assistance',
    number: '1800-425-1550',
    hours: '9 AM - 5 PM (Mon-Sat)'
  }
]
</script>
