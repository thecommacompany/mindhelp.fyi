<template>
  <div class="p-5">
    <h2 class="text-2xl font-bold text-emerald-800 mb-6 text-center">I'm looking for...</h2>
  
  <div class="search-form">
    
    <div class="form-group">
      <select v-model="form.serviceType" class="form-select">
        <option value="">All Services</option>
        <option v-for="(value, key) in SERVICE_TYPES" :key="key" :value="key">
          {{ formatServiceType(value) }}
        </option>
      </select>
    </div>

    <div class="form-group">
      <select v-model="form.entityType" class="form-select">
        <option value="">All Types</option>
        <option value="professional">Professional</option>
        <option value="hospital">Hospital</option>
        <option value="organization">Organization</option>
        <option value="support-group">Support Group</option>
      </select>
    </div>

    <div class="form-group">
      <LocationSearchPhoton v-model="selectedLocation" :latitude="initialLocation?.latitude" :longitude="initialLocation?.longitude" placeholder="Enter location" />
    </div>

    <div class="form-group">
      <select v-model="form.maxDistance" class="form-select">
        <option value="10">Within 10 km</option>
        <option value="25">Within 25 km</option>
        <option value="50">Within 50 km</option>
        <option value="100">Within 100 km</option>
      </select>
    </div>

    <button  class="submit-btn" @click="handleSubmit">
      Search
      <Icon name="heroicons:magnifying-glass" class="search-icon" />
    </button>
  </div>
</div>
</template>

<script setup lang="ts">
interface SearchForm {
  serviceType: string
  entityType: string
  maxDistance: string
  latitude?: number
  longitude?: number
}
interface Props {
  initialValues?: Partial<SearchForm>
  initialLocation?: {
    latitude: number
    longitude: number
    display: string
  } | undefined
}

const props = defineProps<Props>()

const selectedLocation = ref(props.initialLocation || {
  latitude: 0,
  longitude: 0,
  display: ''
})

const form = ref<SearchForm>({
  serviceType: props.initialValues?.serviceType || '',
  entityType: props.initialValues?.entityType || '',
  maxDistance: props.initialValues?.maxDistance || '50',
  latitude: props.initialValues?.latitude || 0,
  longitude: props.initialValues?.longitude || 0,
})

const emit = defineEmits<{
  (e: 'submitSearch', form: SearchForm): void
}>()

const SERVICE_TYPES = {
  PSYCHIATRIST: 'psychiatrist',
  PSYCHOLOGIST: 'psychologist',
  THERAPIST: 'therapist',
  COUNSELOR: 'counselor',
  ADDICTION_COUNSELING: 'addiction-counseling',
  CHILD_ADOLESCENT: 'child-adolescent',
  FAMILY_COUNSELING: 'family-counseling',
  RELATIONSHIP_COUNSELING: 'relationship-counseling',
  GRIEF_COUNSELING: 'grief-counseling',
  TRAUMA_COUNSELING: 'trauma-counseling',
  SUPPORT_GROUP: 'support-group',
  PEER_SUPPORT: 'peer-support',
  CRISIS_HELPLINE: 'crisis-helpline',
  EMERGENCY: 'emergency',
} as const

const formatServiceType = (value: string) => {
  return value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const handleSubmit = () => {
  console.log(selectedLocation.value)
  if (selectedLocation.value.latitude && selectedLocation.value.longitude) {
    form.value.latitude = selectedLocation.value.latitude
    form.value.longitude = selectedLocation.value.longitude
   
  }
  emit('submitSearch', { ...form.value })
}

</script>

<style scoped>
.search-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;


  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-select {
  padding: 0.75rem;
  border: 1px solid #E2E8F0;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-select:hover {
  border-color: #B8C5B0;
}

.form-select:focus {
  outline: none;
  border-color: #B8C5B0;
  box-shadow: 0 0 0 2px rgba(184, 197, 176, 0.2);
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #F7D794;
  color: #2D3748;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  background-color: #f5cb6f;
  transform: translateY(-1px);
}

.search-icon {
  width: 1.25rem;
  height: 1.25rem;
}

@media (min-width: 640px) {
  .search-form {
    flex-direction: row;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .form-group {
    flex: 1;
    min-width: 200px;
  }

  .submit-btn {
    min-width: 120px;
  }
}
</style>