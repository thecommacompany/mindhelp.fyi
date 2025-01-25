<template>
  <div class="p-3 mx-auto py-10 min-h-[50vh]">
 
    <DashboardProfessionalsDataTable 
      :professionals="professionals" 
      :professionalsError="professionalsError"
      :isProfessionalsLoading="isProfessionalsLoading"
      @edit-professional="editProfessional"
      @delete-professional="deleteProfessional"
      @refresh-professionals="refreshProfessionals"
      @open-create-dialog="openCreateDialog"
      />
    <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
      <DialogContent class="max-h-[89vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Edit Professional' : 'Add Professional' }}</DialogTitle>
        </DialogHeader>
     
        <Tabs v-model="activeTab" class="w-full">
          <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
         <DashboardProfessionalsDataTab :form="form" :isEditing="isEditing" :errors="errors" :active-tab="activeTab" :isLoadingLocation="isLoadingLocation" :locationDisplay="locationDisplay"
         @handle-submit="activeTab = 'services'"
         @get-current-location="getCurrentLocation"
         />
          </TabsContent>
          <TabsContent value="services">
     <DashboardProfessionalsServiceTab :ServiceType="ServiceType" :form="form" :isEditing="isEditing" @change-tab="activeTab = 'details'" @handle-submit="handleSubmit" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
   
  </div>

</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { ProfessionalSchemaType } from '@/schemas/professionals'
import { professionalSchema } from '@/schemas/professionals'
import { ServiceType } from '@/server/database/schema'
import { useProfile } from '@/composables/useProfile'
import { useToast } from '@/composables/useToast'
import { useProfessional } from '@/composables/useProfessional'

const { profile } = useProfile()
const { showToast } = useToast()
const { 
  professionals, 
  professionalsStatus, 
  professionalsError,
  isProfessionalsLoading,
  isProfessionalsPending,
  refreshProfessionals,
  submitProfessional,
  getProfessionalById
} = useProfessional()

const searchQuery = ref('')
const isDialogOpen = ref(false)
const isEditing = ref(false)
const currentProfessional = ref<ProfessionalSchemaType | null>(null)
const errors = ref<Record<string, string>>({})
const activeTab = ref('details')

const form = ref<ProfessionalSchemaType>({
  id: undefined,
  name: '',
  phone: '',
  specialization: '',
  qualifications: '',
  licenseNumber: null,
  experience: null,
  availableForOnline: false,
  languages: '',
  address: null,
  city: null,
  state: null,
  country: null,
  consultationFees: null,
  latitude: null,
  longitude: null,
  isClaimable: true,
  claimedBy: null,
  verificationStatus: 'pending',
  profileId: null,
  services: []
})

const locationDisplay = ref('')
const isLoadingLocation = ref(false)

async function updateLocationDisplay() {
  if (form.value.latitude && form.value.longitude) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${form.value.latitude}&lon=${form.value.longitude}&format=json`
      )
      const data = await response.json()
      locationDisplay.value = data.display_name.split(',').slice(0, 3).join(',')
    } catch (error) {
      console.error('Failed to fetch location details:', error)
      locationDisplay.value = 'Location found but address lookup failed'
    }
  } else {
    locationDisplay.value = ''
  }
}

async function getCurrentLocation() {
  isLoadingLocation.value = true
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
    
    form.value.latitude = position.coords.latitude
    form.value.longitude = position.coords.longitude
    await updateLocationDisplay()
    showToast('Location updated successfully', 'success')
  } catch (error) {
    console.error('Failed to get location:', error)
    showToast('Failed to get your location. Please ensure location access is enabled.', 'error')
  } finally {
    isLoadingLocation.value = false
  }
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
  await refreshProfessionals()
})

// Watch for changes in professionals state
watch(professionals, (newVal) => {
  if (newVal?.data) {
    console.log('Professionals updated:', newVal.data)
  }
}, { deep: true })

const filteredProfessionals = computed(() => {
  if (!professionals.value?.data) return []
  
  return professionals.value.data.filter(professional => 
    professional.specialization?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.qualifications?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

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
    if (formData.experience) {
      formData.experience = Number(formData.experience)
    }
    if (formData.consultationFees) {
      formData.consultationFees = Number(formData.consultationFees)
    }

    // Validate using Zod schema
    const result = professionalSchema.safeParse(formData)
    
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

function openCreateDialog() {
  isEditing.value = false
  currentProfessional.value = null
  form.value = {
    id: undefined,
    name: '',
    phone: '',
    specialization: '',
    qualifications: '',
    licenseNumber: null,
    experience: null,
    availableForOnline: false,
    languages: '',
    address: null,
    city: null,
    state: null,
    country: null,
    consultationFees: null,
    latitude: null,
    longitude: null,
    isClaimable: false,
    claimedBy: null,
    verificationStatus: 'pending',
    profileId: null,
  }
  let services=ref([])
  isDialogOpen.value = true
}
const fetchedProfessional = ref<ProfessionalSchemaType | null>(null)
async function editProfessional(professionalID: string) {
  isEditing.value = true
  // Fetch latest professional data
  const { data: fetchedProfessional } =  getProfessionalById(professionalID)
  watch(fetchedProfessional, (newValue) => {
    if (newValue) {
      form.value = { ...newValue }
      currentProfessional.value = newValue
    }
  }, { immediate: true })
  isDialogOpen.value = true
}

async function deleteProfessional(professional: ProfessionalSchemaType) {
  try {
    if (!confirm('Are you sure you want to delete this professional?')) {
      return
    }

    const formData = new FormData()
    formData.append('id', professional.id!)
    
    const { success, error } = await submitProfessional(formData, 'DELETE')
    
    if (success) {
      showToast('Professional deleted successfully', 'success')
      await refreshProfessionals()
    } else {
      showToast(error || 'Failed to delete professional', 'error')
    }
  } catch (error) {
    console.error('Failed to delete professional:', error)
    showToast('An unexpected error occurred', 'error')
  }
}

async function handleSubmit() {
  try {
    if (!validateForm()) {
      return
    }

    // Check required fields
    const requiredFields = ['name', 'phone', 'specialization', 'qualifications', 'languages'] as const
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
        formData.append(key, value.toString())
      }
    })

    // If editing, append the ID and use PATCH
    if (currentProfessional.value?.id) {
      formData.append('id', currentProfessional.value.id)
      const { success, error } = await submitProfessional(formData, 'PATCH')
      
      if (success) {
        isDialogOpen.value = false
        showToast('Professional updated successfully', 'success')
      } else {
        console.error('Failed to update professional:', error)
        showToast(error || 'Failed to update professional', 'error')
      }
    } else {
      // Creating new professional
      const { success, error } = await submitProfessional(formData, 'POST')
      
      if (success) {
        isDialogOpen.value = false
        showToast('Professional added successfully', 'success')
      } else {
        console.error('Failed to create professional:', error)
        showToast(error || 'Failed to create professional', 'error')
      }
    }
  } catch (error) {
    console.error('Failed to submit professional:', error)
    showToast('An unexpected error occurred', 'error')
  }
}

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})
</script>