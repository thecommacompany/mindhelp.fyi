<template>
  <section class="py-16">
    <div class="max-w-3xl mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
        <h2 class="text-2xl font-bold text-emerald-800 mb-6 text-center">I'm looking for...</h2>
        
        <div class="space-y-6">
          <!-- Professional Type Selection -->
          <div class="space-y-2">
            <label class="block text-gray-700 font-medium">Type of Support</label>
            <select class="w-full p-3 rounded-lg border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200">
              <option value="">Select type of support</option>
              <option value="psychiatrist">A Psychiatrist</option>
              <option value="therapist">A Therapist</option>
              <option value="counselor">A Counselor</option>
              <option value="support-group">Support Groups</option>
              <option value="emergency">Emergency Services</option>
            </select>
          </div>

          <!-- Location Selection -->
          <div class="space-y-2">
            <label class="block text-gray-700 font-medium">Location</label>
            <LocationSearch />
          </div>

          <!-- Search Button -->
          <button class="w-full bg-emerald-600 text-white py-4 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2">
            <span class="material-icons">search</span>
            <span>Find Resources</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Reusing the LocationSearch component
</script>
