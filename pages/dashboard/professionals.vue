<template>
  <div class="p-3 mx-auto py-10 min-h-[50vh]">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Professionals</h2>
      <Button @click="openCreateDialog">Add Professional</Button>
    </div>

    <div class="flex items-center py-4">
      <Input
        v-model="searchQuery"
        placeholder="Search professionals..."
        class="max-w-sm"
      />
    </div>

    <div v-if="isProfessionalsLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-500"></div>
    </div>

    <div v-else-if="professionalsError" class="text-red-500 text-center py-12">
      {{ professionalsError }}
      <Button 
        @click="refreshProfessionals" 
        class="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
      >
        Try Again
    </Button>
    </div>

    <div v-else class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Profile ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Qualifications</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="professional in filteredProfessionals" :key="professional.profileId">
            <TableCell>{{ professional.profileId }}</TableCell>
            <TableCell>{{ professional.name }}</TableCell>
            <TableCell>{{ professional.phone }}</TableCell>
            <TableCell>{{ professional.specialization }}</TableCell>
            <TableCell>{{ professional.qualifications }}</TableCell>
            <TableCell>{{ professional.experience }} years</TableCell>
            <TableCell>
              <Badge :variant="getStatusVariant(professional.verificationStatus)">
                {{ professional.verificationStatus }}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" @click="editProfessional(professional)">
                <Icon name="heroicons:pencil" class="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" @click="deleteProfessional(professional)">
                <Icon name="heroicons:trash" class="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Edit Professional' : 'Add Professional' }}</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input 
                id="name" 
                v-model="form.name" 
                placeholder="e.g., Dr. John Doe"
                required 
              />
              <div v-if="errors.name" class="text-red-500">{{ errors.name }}</div>
            </div>
            <div class="space-y-2">
              <Label for="phone">Phone</Label>
              <Input 
                id="phone" 
                v-model="form.phone" 
                placeholder="e.g., +1234567890"
                required 
              />
              <div v-if="errors.phone" class="text-red-500">{{ errors.phone }}</div>
            </div>
            <div class="space-y-2">
              <Label for="specialization">Specialization</Label>
              <Input 
                id="specialization" 
                v-model="form.specialization" 
                placeholder="e.g., Psychiatrist, Psychologist"
                required 
              />
              <div v-if="errors.specialization" class="text-red-500">{{ errors.specialization }}</div>
            </div>
            <div class="space-y-2">
              <Label for="qualifications">Qualifications</Label>
              <Input 
                id="qualifications" 
                v-model="form.qualifications" 
                placeholder="e.g., MD in Psychiatry, PhD in Psychology"
                required 
              />
              <div v-if="errors.qualifications" class="text-red-500">{{ errors.qualifications }}</div>
            </div>
            <div class="space-y-2">
              <Label for="experience">Experience (years)</Label>
              <Input 
                id="experience" 
                type="number" 
                v-model="form.experience" 
                placeholder="e.g., 5"
              />
              <div v-if="errors.experience" class="text-red-500">{{ errors.experience }}</div>
            </div>
            <div class="space-y-2">
              <Label for="licenseNumber">License Number</Label>
              <Input 
                id="licenseNumber" 
                v-model="form.licenseNumber" 
                placeholder="e.g., MCI-12345"
              />
              <div v-if="errors.licenseNumber" class="text-red-500">{{ errors.licenseNumber }}</div>
            </div>
            <div class="space-y-2">
              <Label for="languages">Languages</Label>
              <Input 
                id="languages" 
                v-model="form.languages" 
                placeholder="e.g., English, Hindi, Spanish"
                required 
              />
              <div v-if="errors.languages" class="text-red-500">{{ errors.languages }}</div>
            </div>
            <div class="space-y-2">
              <Label for="consultationFees">Consultation Fees</Label>
              <Input 
                id="consultationFees" 
                type="number" 
                v-model="form.consultationFees" 
                placeholder="e.g., 1000"
              />
              <div v-if="errors.consultationFees" class="text-red-500">{{ errors.consultationFees }}</div>
            </div>
            <div class="space-y-2">
              <Label for="address">Address</Label>
              <Input 
                id="address" 
                v-model="form.address" 
                placeholder="e.g., 123 Main Street, Suite 45"
              />
              <div v-if="errors.address" class="text-red-500">{{ errors.address }}</div>
            </div>
            <div class="space-y-2">
              <Label for="city">City</Label>
              <Input 
                id="city" 
                v-model="form.city" 
                placeholder="e.g., Mumbai"
                
              />
              <div v-if="errors.city" class="text-red-500">{{ errors.city }}</div>
            </div>
            <div class="space-y-2">
              <Label for="state">State</Label>
              <Input 
                id="state" 
                v-model="form.state" 
                placeholder="e.g., Maharashtra"
                
              />
              <div v-if="errors.state" class="text-red-500">{{ errors.state }}</div>
            </div>
            <div class="space-y-2">
              <Label for="country">Country</Label>
              <Input 
                id="country" 
                v-model="form.country" 
                placeholder="e.g., India"
                
              />
              <div v-if="errors.country" class="text-red-500">{{ errors.country }}</div>
            </div>
            <div class="space-y-2">
              <Label>Location</Label>
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    @click="getCurrentLocation"
                    :disabled="isLoadingLocation"
                  >
                    <div class="flex items-center gap-2">
                      <Icon 
                        :name="isLoadingLocation ? 'heroicons:arrow-path' : 'heroicons:map-pin'" 
                        class="w-4 h-4"
                        :class="{ 'animate-spin': isLoadingLocation }"
                      />
                      {{ isLoadingLocation ? 'Getting Location...' : 'Get Current Location' }}
                    </div>
                  </Button>
                </div>
                <div v-if="locationDisplay" class="text-sm text-gray-600">
                  {{ locationDisplay }}
                </div>
                <div v-if="errors.latitude || errors.longitude" class="text-red-500 text-sm">
                  {{ errors.latitude || errors.longitude }}
                </div>
              </div>
            </div>
            <div class="space-y-2 flex items-center gap-2">
              <Checkbox id="availableForOnline" :checked="form.availableForOnline" @update:checked="form.availableForOnline=!form.availableForOnline" />
              <Label for="availableForOnline">Available for online</Label>
            </div>
            <div class="space-y-2 flex items-center gap-2">
              <Checkbox id="isClaimable" :checked="form.isClaimable"  @update:checked="form.isClaimable=!form.isClaimable"/>
              <Label for="isClaimable">This is not my data</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{{ isEditing ? 'Update' : 'Create' }}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { ProfessionalSchemaType } from '@/schemas/professionals'
import { professionalSchema } from '@/schemas/professionals'
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
  submitProfessional 
} = useProfessional()

const searchQuery = ref('')
const isDialogOpen = ref(false)
const isEditing = ref(false)
const currentProfessional = ref<ProfessionalSchemaType | null>(null)
const errors = ref<Record<string, string>>({})

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
  isClaimable: false,
  claimedBy: null,
  verificationStatus: 'pending',
  profileId: null
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

// Initial load and periodic refresh
onMounted(async () => {
  await refreshProfessionals()
  // Set up periodic refresh every 30 seconds
  setInterval(async () => {
    await refreshProfessionals()
  }, 30000)
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
    profileId: null
  }
  isDialogOpen.value = true
}

function editProfessional(professional: ProfessionalSchemaType) {
  isEditing.value = true
  currentProfessional.value = professional
  form.value = { ...professional }
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
    
    // Then append optional fields that have values
    Object.entries(form.value).forEach(([key, value]) => {
      if (!requiredFields.includes(key as any) && value !== null && value !== undefined && value !== '') {
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