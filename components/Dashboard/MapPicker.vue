<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'

const location = reactive({
  lat: 9.93988000,
  longi: 76.2602200
})

const marker = ref(null)
const mapPickerElement = ref(null)
const mapPicker = ref(null)

async function initMap() {
  if (process.client) {
    const L = await import('leaflet')
    // Fix Leaflet's icon paths
    delete L.Icon.Default.prototype._getIconUrl

    const iconRetinaUrl = new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href
    const iconUrl = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href
    const shadowUrl = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    })
    mapPicker.value = L.map(mapPickerElement.value).setView([51.505, -0.09], 13)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapPicker.value)

    marker.value = L.marker([location.lat, location.longi]).addTo(mapPicker.value)
    mapPicker.value.setView([location.lat, location.longi], 8)

    mapPicker.value.on('click', (e) => { 
      location.lat = e.latlng.lat
      location.longi = e.latlng.lng
      if (marker.value) {
        marker.value.remove()
      }
      marker.value = L.marker([e.latlng.lat, e.latlng.lng]).addTo(mapPicker.value)
    })
  }
}

onMounted(() => {
  initMap()
})

const emit = defineEmits(['location-picked'])
</script>

<template>
     <div class=" py-2">
    <Button @click="$emit('location-picked', location)" variant="ghost" class="bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white"><Icon name="heroicons:check" class="h-4 w-4 mr-2" />Set Location</Button>
  </div>
  <div ref="mapPickerElement" style="height: 300px; width: 300px" />
 
</template>

<style>
@import 'leaflet/dist/leaflet.css';
</style>
