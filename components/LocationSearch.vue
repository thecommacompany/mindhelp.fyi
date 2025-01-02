<template>
  <div class="relative">
    <HeadlessListbox v-model="selectedLocation" as="div">
      <HeadlessListboxButton
        class="relative w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 border border-gray-200 text-gray-700"
      >
        <span class="material-icons text-emerald-600">location_on</span>
        <span class="block truncate">{{ selectedLocation?.name || 'Select Location' }}</span>
        <span class="material-icons ml-auto transition-transform duration-200" 
              :class="{ 'rotate-180': '' }">expand_more</span>
      </HeadlessListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <HeadlessListboxOptions
          class="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-1 max-h-60 overflow-auto focus:outline-none"
        >
          <!-- Search Input -->
          <div class="sticky top-0 p-2 bg-white border-b border-gray-100">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search districts..."
                class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                @click.stop
              />
              <span class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            </div>
          </div>

          <div class="py-1">
            <HeadlessListboxOption
              v-for="location in filteredLocations"
              :key="location.id"
              :value="location"
              v-slot="{ active, selected }"
              as="template"
            >
              <li
                :class="[
                  'px-4 py-2 cursor-pointer flex items-center',
                  active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700',
                ]"
              >
                <span class="material-icons mr-2" v-if="selected">check</span>
                <span :class="{ 'ml-6': !selected }">{{ location.name }}</span>
              </li>
            </HeadlessListboxOption>
          </div>
        </HeadlessListboxOptions>
      </transition>
    </HeadlessListbox>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Location {
  id: number
  name: string
}

const searchQuery = ref('')
const selectedLocation = ref<Location | null>(null)

const locations: Location[] = [
  { id: 1, name: 'Thiruvananthapuram' },
  { id: 2, name: 'Kollam' },
  { id: 3, name: 'Pathanamthitta' },
  { id: 4, name: 'Alappuzha' },
  { id: 5, name: 'Kottayam' },
  { id: 6, name: 'Idukki' },
  { id: 7, name: 'Ernakulam' },
  { id: 8, name: 'Thrissur' },
  { id: 9, name: 'Palakkad' },
  { id: 10, name: 'Malappuram' },
  { id: 11, name: 'Kozhikode' },
  { id: 12, name: 'Wayanad' },
  { id: 13, name: 'Kannur' },
  { id: 14, name: 'Kasaragod' }
]

const filteredLocations = computed(() => {
  if (!searchQuery.value) return locations
  return locations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
