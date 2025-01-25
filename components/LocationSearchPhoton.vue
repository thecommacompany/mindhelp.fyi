<template>
  <div class="relative bg-white">
    <HeadlessListbox v-model="selectedLocation" as="div">
      <HeadlessListboxButton
        class="relative w-full flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-50 border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 text-gray-700"
      >
        <Icon name="material-symbols:location-on" class="text-emerald-600" />
        <span class="block truncate">
          {{ selectedLocation ? formatDisplayValue(selectedLocation) : 'Search for a location...' }}
        </span>
        <Icon 
          name="material-symbols:expand-more" 
          class="ml-auto transition-transform duration-200"
          :class="{ 'rotate-180': '' }"
        />
      </HeadlessListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <HeadlessListboxOptions
          class="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-emerald-100 py-1 max-h-60 overflow-auto focus:outline-none"
        >
          <!-- Search Input -->
          <div class="sticky top-0 p-2 bg-white border-b border-gray-100">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search locations..."
                class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                @input="handleInput"
                @click.stop
                @keydown.stop
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2">
                <Icon 
                  v-if="isLoading" 
                  name="material-symbols:refresh" 
                  class="animate-spin text-emerald-600" 
                />
                <Icon 
                  v-else 
                  name="material-symbols:search" 
                  class="text-gray-400" 
                />
              </div>
            </div>
          </div>

          <div v-if="isLoading" class="p-4 text-center text-gray-500">
            Searching...
          </div>
          <div v-else-if="searchResults.length === 0 && searchQuery" class="p-4 text-center text-gray-500">
            No locations found
          </div>
          <div v-else class="py-1">
            <HeadlessListboxOption
              v-for="location in searchResults"
              :key="location.properties.osm_id"
              :value="location"
              v-slot="{ active }"
              as="template"
            >
              <li
                :class="[
                  'px-4 py-2 cursor-pointer',
                  active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700',
                ]"
              >
                <div class="flex items-center justify-between">
                  <span class="font-medium">{{ location.properties.name }}</span>
                  <span 
                    :class="[
                      'text-xs px-2 py-1 rounded-full',
                      getTypeColor(location.properties.type)
                    ]"
                  >
                    {{ formatType(location.properties.type) }}
                  </span>
                </div>
                <div class="flex items-center text-sm text-gray-600 gap-1 mt-1">
                  <Icon name="material-symbols:location-on" class="text-gray-400" />
                  <span>{{ formatLocationDetails(location.properties) }}</span>
                </div>
              </li>
            </HeadlessListboxOption>
          </div>
        </HeadlessListboxOptions>
      </transition>
    </HeadlessListbox>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { useToast } from '~/composables/useToast'

interface PhotonProperties {
  osm_id: number
  name: string
  state?: string
  country: string
  type: string
  city?: string
  county?: string
  postcode?: string
  osm_value: string
}

interface PhotonFeature {
  geometry: {
    coordinates: [number, number]
    type: string
  }
  properties: PhotonProperties
}

const props = defineProps<{
  modelValue?: { lat: number; lng: number; display: string }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: { lat: number; lng: number; display: string } | undefined): void
}>()

const { showToast } = useToast()
const searchQuery = ref('')
const searchResults = ref<PhotonFeature[]>([])
const isLoading = ref(false)
const selectedLocation = ref<PhotonFeature | null>(null)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Format type for display
const formatType = (type: string): string => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

// Get type color class
const getTypeColor = (type: string): string => {
  const colors = {
    city: 'bg-blue-100 text-blue-800',
    county: 'bg-purple-100 text-purple-800',
    village: 'bg-green-100 text-green-800',
    default: 'bg-gray-100 text-gray-800'
  }
  return colors[type as keyof typeof colors] || colors.default
}

// Format location details
const formatLocationDetails = (props: PhotonProperties): string => {
  const parts = [
    props.city,
    props.county,
    props.state,
    props.country,
    props.postcode
  ].filter(Boolean)
  return parts.join(', ')
}

// Format display value for input
const formatDisplayValue = (location: PhotonFeature): string => {
  return `${location.properties.name}, ${formatLocationDetails(location.properties)}`
}

// Search function
const searchLocation = async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  try {
    const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`)
    if (!response.ok) throw new Error('Failed to fetch locations')
    
    const data = await response.json()
    searchResults.value = data.features || []
  } catch (error) {
    showToast('Failed to fetch locations. Please try again.', 'error')
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

// Handle input changes with debounce
const handleInput = () => {
  // Clear previous timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  // Set new timeout
  searchTimeout = setTimeout(() => {
    searchLocation(searchQuery.value)
  }, 300)
}

// Watch for selected location changes
watch(selectedLocation, (location) => {
  if (location) {
    const [lng, lat] = location.geometry.coordinates
    emit('update:modelValue', {
      lat,
      lng,
      display: formatDisplayValue(location)
    })
  } else {
    emit('update:modelValue', undefined)
  }
})

// Watch for v-model changes
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    selectedLocation.value = null
    searchQuery.value = ''
  }
}, { deep: true })

// Cleanup
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
})
</script>
