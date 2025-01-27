<template>
  <div class="p-3 mx-auto py-10 min-h-[50vh]">
    <DashboardHosptialsDataTable 
      :hospitals="hospitals?.data || []" 
      :hospitalsError="hospitalsError"
      :isHospitalsLoading="isHospitalsLoading"
      @edit-hospital="editHospital"
      @delete-hospital="deleteHospital"
      @refresh-hospitals="refreshHospitals"
      @open-create-dialog="openCreateDialog"
    />
    
    <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
      <DialogContent class="max-h-[89vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Edit Hospital' : 'Add Hospital' }}</DialogTitle>
        </DialogHeader>
        
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <DashboardHosptialsDataTab 
              :form="form" 
              :isEditing="isEditing" 
              :errors="errors" 
              :active-tab="activeTab" 
              :isLoadingLocation="isLoadingLocation" 
              :locationDisplay="locationDisplay"
              :showMapPicker="showMapPicker"
              @handle-submit="activeTab = 'services'"
              @get-current-location="getCurrentLocation"
              @location-picked="handleLocationPicked"
              @toggle-map-picker="showMapPicker = !showMapPicker"
            />
          </TabsContent>
          <TabsContent value="services">
            <DashboardHosptialsServiceTab 
              :ServiceType="ServiceType" 
              :form="form" 
              :isEditing="isEditing" 
              @change-tab="activeTab = 'details'" 
              @handle-submit="handleSubmit" 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { hospitalSchema, type HospitalSchemaType } from '@/schemas/hospitals'
import { useHospital } from '@/composables/useHospital'
import { useProfile } from '@/composables/useProfile'
import { useToast } from '@/composables/useToast'
import { z } from 'zod'
import MapPicker from '@/components/Dashboard/MapPicker.vue'
import Map from '@/components/Dashboard/Map.vue'
import { ServiceType } from '@/server/database/schema'

const { profile } = useProfile()
const { showToast } = useToast()
const { 
  hospitals, 
  hospitalsStatus,
  hospitalsError,
  isHospitalsLoading,
  refreshHospitals,
  submitHospital,
  getHospitalById
} = useHospital()

const searchQuery = ref('')
const isDialogOpen = ref(false)
const isEditing = ref(false)
const currentHospital = ref<HospitalSchemaType | null>(null)
const locationDisplay = ref('')
const isLoadingLocation = ref(false)
const showMapPicker = ref(false)
const activeTab = ref('details')

const form = ref<HospitalSchemaType>({
  id: undefined,
  name: '',
  type: '',
  phone: '',
  email: '',
  website: '',
  emergencyServices: false,
  address: null,
  city: null,
  state: null,
  country: null,
  latitude: null,
  longitude: null,
  isClaimable: true,
  claimedBy: null,
  verificationStatus: 'pending',
  profileId: null,
  services: []
})

const errors = ref<Record<string, string>>({})

const filteredHospitals = computed(() => {
  if (!hospitals.value?.data) return []
  
  return hospitals.value.data.filter(hospital => 
    hospital.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    hospital.type?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    hospital.city?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    hospital.facilities?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

async function updateLocationDisplay() {
  if (form.value.latitude && form.value.longitude) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${form.value.latitude}&lon=${form.value.longitude}&format=json`
      )
      const data = await response.json()
      locationDisplay.value = data.display_name.split(',').slice(0, 3).join(',')
    } catch (error) {
      console.error('Error getting location display:', error)
      locationDisplay.value = `${form.value.latitude}, ${form.value.longitude}`
    }
  } else {
    locationDisplay.value = ''
  }
}

async function getCurrentLocation() {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser', 'error')
    return
  }

  isLoadingLocation.value = true
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    form.value.latitude = position.coords.latitude
    form.value.longitude = position.coords.longitude
    await updateLocationDisplay()
  } catch (error) {
    console.error('Error getting current location:', error)
    showToast('Failed to get your current location', 'error')
  } finally {
    isLoadingLocation.value = false
  }
}

function handleLocationPicked(location: { lat: number; longi: number }) {
  form.value.latitude = location.lat
  form.value.longitude = location.longi
  showMapPicker.value = false
}

// Watch for changes in latitude/longitude
watch([() => form.value.latitude, () => form.value.longitude], () => {
  updateLocationDisplay()
})

// Watch for changes in isClaimable to auto-fill user data
watch(() => form.value.isClaimable, (newValue) => {
  if (!newValue && profile.value?.data) {
    // If not claimable, populate with current user's data
    form.value = {
      ...form.value,
      name: profile.value.data.name,
      city: profile.value.data.city,
      state: profile.value.data.state,
      country: profile.value.data.country,
    }
  }
})

// Initial load
onMounted(async () => {
  await refreshHospitals()
})

// Watch for changes in hospitals state
watch(hospitals, (newVal) => {
  if (newVal?.data) {
    console.log('Hospitals updated:', newVal.data)
  }
}, { deep: true })

function getStatusVariant(status: string): "default" | "destructive" | "secondary" | "outline" {
  switch (status) {
    case 'verified':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'rejected':
      return 'destructive'
    default:
      return 'outline'
  }
}

function validateForm() {
  try {
    const formData = { ...form.value }
    
    // Convert string numbers to actual numbers
    if (formData.latitude) {
      formData.latitude = Number(formData.latitude)
    }
    if (formData.longitude) {
      formData.longitude = Number(formData.longitude)
    }

    // Validate using Zod schema
    const result = hospitalSchema.safeParse(formData)
    
    if (!result.success) {
      errors.value = {}
      result.error.errors.forEach((error) => {
        if (error.path) {
          errors.value[error.path[0]] = error.message
        }
      })
      showToast('Please fix the validation errors', 'error')
      console.log('Validation errors:', errors.value)
      return false
    }
    
    errors.value = {}
    return true
  } catch (error) {
    console.error('Validation error:', error)
    showToast('An error occurred during validation', 'error')
    return false
  }
}

async function handleSubmit() {
  try {
    if (!validateForm()) {
      return
    }

    // Check required fields
    const requiredFields = ['name', 'type', 'phone'] as const
    const missingFields = requiredFields.filter(field => !form.value[field])
    
    if (missingFields.length > 0) {
      showToast(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error')
      return
    }

    const formData = new FormData()
    
    // First append all required fields
    requiredFields.forEach(field => {
      formData.append(field, form.value[field] as string)
    })
    
    // Handle services array separately
    if (form.value.services && Array.isArray(form.value.services)) {
      formData.append('services', JSON.stringify(form.value.services))
    }
    
    // Then append optional fields that have values
    Object.entries(form.value).forEach(([key, value]) => {
      if (key !== 'services' && !requiredFields.includes(key as any) && value !== null && value !== undefined && value !== '') {
        if (key === 'isClaimable') {
          formData.append(key, String(value))
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString())
        } else {
          formData.append(key, value.toString())
        }
      }
    })

    // If editing, append the ID and use PATCH
    if (currentHospital.value?.id) {
      formData.append('id', currentHospital.value.id)
      const { success, error } = await submitHospital(formData, 'PATCH')
      
      if (success) {
        isDialogOpen.value = false
        showToast('Hospital updated successfully', 'success')
        await refreshHospitals()
      } else {
        console.error('Failed to update hospital:', error)
        showToast(error || 'Failed to update hospital', 'error')
      }
    } else {
      // Creating new hospital
      const { success, error } = await submitHospital(formData, 'POST')
      
      if (success) {
        isDialogOpen.value = false
        showToast('Hospital added successfully', 'success')
        await refreshHospitals()
      } else {
        console.error('Failed to create hospital:', error)
        showToast(error || 'Failed to create hospital', 'error')
      }
    }
  } catch (error) {
    console.error('Failed to submit hospital:', error)
    showToast('An unexpected error occurred', 'error')
  }
}

function resetForm() {
  form.value = {
    name: '',
    phone: '',
    type: '',
    facilities: '',
    emergencyServices: false,
    accreditation: '',
    website: '',
    openingHours: '',
    address: '',
    city: '',
    state: '',
    country: '',
    latitude: 0,
    longitude: 0,
    isClaimable: true,
    claimedBy: undefined,
    verificationStatus: 'pending',
    profileId: undefined,
    services: []
  }
}

function openCreateDialog() {
  isEditing.value = false
  currentHospital.value = null
  resetForm()
  isDialogOpen.value = true
  errors.value = {}
}

function editHospital(hospital: HospitalSchemaType) {
  isEditing.value = true
  // Fetch latest hospital data
  const { data: fetchedHospital } = getHospitalById(hospital.id!)
  watch(fetchedHospital, (newValue) => {
    if (newValue) {
      form.value = {
        ...newValue,
        facilities: newValue.facilities || '',
        accreditation: newValue.accreditation || '',
        website: newValue.website || '',
        openingHours: newValue.openingHours || '',
        services: newValue.services || []
      }
      currentHospital.value = newValue
    }
  }, { immediate: true })
  isDialogOpen.value = true
  updateLocationDisplay()
}

async function deleteHospital(hospital: HospitalSchemaType) {
  try {
    if (!confirm('Are you sure you want to delete this hospital?')) {
      return
    }

    const formData = new FormData()
    formData.append('id', hospital.id!)
    
    const { success, error } = await submitHospital(formData, 'DELETE')
    
    if (success) {
      showToast('Hospital deleted successfully', 'success')
      await refreshHospitals()
    } else {
      showToast(error || 'Failed to delete hospital', 'error')
    }
  } catch (error) {
    console.error('Failed to delete hospital:', error)
    showToast('An unexpected error occurred', 'error')
  }
}

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})
</script>
