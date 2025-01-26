<template>
  <div class="p-3 mx-auto py-10 min-h-[50vh]">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Hospitals</h2>
      <Button @click="openCreateDialog">Add Hospital</Button>
    </div>

    <div class="flex items-center py-4">
      <Input
        placeholder="Search hospitals..."
        class="max-w-sm"
        v-model="searchQuery"
      />
    </div>

    <div v-if="isHospitalsLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-500"></div>
    </div>

    <div v-else-if="hospitalsError" class="text-red-500 text-center py-12">
      {{ hospitalsError }}
      <Button 
        @click="refreshHospitals" 
        class="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
      >
        Try Again
      </Button>
    </div>

    <div v-else-if="!filteredHospitals?.length" class="text-center py-12 text-gray-500">
      No hospitals found. Click "Add Hospital" to create one.
    </div>

    <div v-else class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Emergency Services</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="hospital in filteredHospitals" :key="hospital?.id">
            <TableCell>{{ hospital?.name || '-' }}</TableCell>
            <TableCell>{{ hospital?.type || '-' }}</TableCell>
            <TableCell>{{ hospital?.phone || '-' }}</TableCell>
            <TableCell>{{ hospital?.city ? `${hospital.city}, ${hospital.state || ''}` : '-' }}</TableCell>
            <TableCell>{{ hospital?.emergencyServices ? 'Available' : 'Not Available' }}</TableCell>
            <TableCell>
              <Badge :variant="getStatusVariant(hospital?.verificationStatus || '')">
                {{ hospital?.verificationStatus || 'pending' }}
              </Badge>
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="icon" @click="editHospital(hospital)">
                  <Icon name="heroicons:pencil" class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" @click="deleteHospital(hospital)">
                  <Icon name="heroicons:trash" class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Dialog :open="isDialogOpen" @update:open="isDialogOpen = $event">
      <DialogContent class="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ isEditing ? 'Edit Hospital' : 'Add Hospital' }}</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Basic Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="name">Name</Label>
                <Input 
                  id="name" 
                  v-model="form.name" 
                  placeholder="e.g., City General Hospital"
                  :class="{ 'border-red-500': errors.name }" 
                />
                <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
              </div>

              <div class="space-y-2">
                <Label for="type">Type</Label>
                <Select v-model="form.type" :class="{ 'border-red-500': errors.type }">
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General Hospital</SelectItem>
                    <SelectItem value="Specialty">Specialty Hospital</SelectItem>
                    <SelectItem value="Teaching">Teaching Hospital</SelectItem>
                    <SelectItem value="Community">Community Hospital</SelectItem>
                    <SelectItem value="Rehabilitation">Rehabilitation Center</SelectItem>
                    <SelectItem value="Mental Health">Mental Health Facility</SelectItem>
                    <SelectItem value="Children">Children's Hospital</SelectItem>
                    <SelectItem value="Cancer">Cancer Center</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p v-if="errors.type" class="text-sm text-red-500">{{ errors.type }}</p>
              </div>

              <div class="space-y-2">
                <Label for="phone">Phone</Label>
                <Input 
                  id="phone" 
                  v-model="form.phone" 
                  placeholder="e.g., +91 1234567890"
                  :class="{ 'border-red-500': errors.phone }" 
                />
                <p v-if="errors.phone" class="text-sm text-red-500">{{ errors.phone }}</p>
              </div>

              <div class="space-y-2">
                <Label for="website">Website</Label>
                <Input 
                  id="website" 
                  v-model="form.website" 
                  placeholder="e.g., https://www.hospital.com"
                  :class="{ 'border-red-500': errors.website }" 
                />
                <p v-if="errors.website" class="text-sm text-red-500">{{ errors.website }}</p>
              </div>
            </div>
          </div>

          <!-- Services & Facilities -->
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Services & Facilities</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="facilities">Facilities</Label>
                <Textarea 
                  id="facilities" 
                  v-model="form.facilities" 
                  placeholder="e.g., ICU, Operation Theater, X-Ray, etc."
                  :class="{ 'border-red-500': errors.facilities }" 
                />
                <p v-if="errors.facilities" class="text-sm text-red-500">{{ errors.facilities }}</p>
              </div>

              <div class="space-y-2">
                <Label for="openingHours">Opening Hours</Label>
                <Input 
                  id="openingHours" 
                  v-model="form.openingHours" 
                  placeholder="e.g., 24/7 or Mon-Sat 9AM-6PM"
                  :class="{ 'border-red-500': errors.openingHours }" 
                />
                <p v-if="errors.openingHours" class="text-sm text-red-500">{{ errors.openingHours }}</p>
              </div>

              <div class="space-y-2">
                <Label for="accreditation">Accreditation</Label>
                <Input 
                  id="accreditation" 
                  v-model="form.accreditation" 
                  placeholder="e.g., NABH, JCI"
                  :class="{ 'border-red-500': errors.accreditation }" 
                />
                <p v-if="errors.accreditation" class="text-sm text-red-500">{{ errors.accreditation }}</p>
              </div>

              <div class="space-y-2">
                <Label>Emergency Services</Label>
                <div class="flex items-center space-x-2 pt-2">
                  <Checkbox id="emergencyServices" :checked="form.emergencyServices" @update:checked="form.emergencyServices=!form.emergencyServices" />
                  <Label for="emergencyServices">24/7 Emergency Services Available</Label>
                </div>
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Location Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2 space-y-2">
                <Label>Current Location</Label>
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <Button 
                      type="button"
                      variant="outline"
                      @click="getCurrentLocation"
                      :disabled="isLoadingLocation"
                    >
                      <Icon 
                        v-if="isLoadingLocation" 
                        name="heroicons:arrow-path" 
                        class="h-4 w-4 animate-spin" 
                      />
                      <Icon 
                        v-else 
                        name="heroicons:map-pin" 
                        class="h-4 w-4" 
                      />
                      Get Current Location
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      @click="showMapPicker = !showMapPicker"
                    >
                      <Icon 
                        name="heroicons:map" 
                        class="h-4 w-4 mr-2" 
                      />
                      {{ showMapPicker ? 'Hide Map' : 'Pick on Map' }}
                    </Button>
                  </div>
                  <div v-if="showMapPicker" class="mt-4">
                    <MapPicker @location-picked="handleLocationPicked" />
                  </div>
                  <div v-if="form.latitude && form.longitude && !showMapPicker" class="mt-4">
                    <Label>Selected Location</Label>
                    <Map 
                      :latitude="form.latitude" 
                      :longitude="form.longitude" 
                    />
                  </div>
                  <p class="text-sm text-gray-500">
                    {{ locationDisplay }}
                  </p>
                </div>
              </div>

              <div class="col-span-2 space-y-2">
                <Label for="address">Address</Label>
                <Textarea 
                  id="address" 
                  v-model="form.address" 
                  placeholder="e.g., 123 Healthcare Avenue, Medical District"
                  :class="{ 'border-red-500': errors.address }" 
                />
                <p v-if="errors.address" class="text-sm text-red-500">{{ errors.address }}</p>
              </div>

              <div class="space-y-2">
                <Label for="city">City</Label>
                <Input 
                  id="city" 
                  v-model="form.city" 
                  placeholder="e.g., Mumbai"
                  :class="{ 'border-red-500': errors.city }" 
                />
                <p v-if="errors.city" class="text-sm text-red-500">{{ errors.city }}</p>
              </div>

              <div class="space-y-2">
                <Label for="state">State</Label>
                <Input 
                  id="state" 
                  v-model="form.state" 
                  placeholder="e.g., Maharashtra"
                  :class="{ 'border-red-500': errors.state }" 
                />
                <p v-if="errors.state" class="text-sm text-red-500">{{ errors.state }}</p>
              </div>

              <div class="space-y-2">
                <Label for="country">Country</Label>
                <Input 
                  id="country" 
                  v-model="form.country" 
                  placeholder="e.g., India"
                  :class="{ 'border-red-500': errors.country }" 
                />
                <p v-if="errors.country" class="text-sm text-red-500">{{ errors.country }}</p>
              </div>
            </div>
          </div>

          <!-- Additional Settings -->
          <div class="space-y-4">
            <h3 class="font-semibold text-lg">Additional Settings</h3>
            <div class="space-y-2">
              <div class="flex items-center space-x-2">
                <Checkbox id="isClaimable" :checked="form.isClaimable" @update:checked="form.isClaimable=!form.isClaimable" />
                <Label for="isClaimable">Allow others to claim this hospital</Label>
              </div>
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
import { hospitalSchema, type HospitalSchemaType } from '@/schemas/hospitals'
import { useHospital } from '@/composables/useHospital'
import { useProfile } from '@/composables/useProfile'
import { useToast } from '@/composables/useToast'
import { z } from 'zod'
import MapPicker from '@/components/Dashboard/MapPicker.vue'
import Map from '@/components/Dashboard/Map.vue'

const { profile } = useProfile()
const { showToast } = useToast()
const { 
  hospitals, 
  hospitalsStatus,
  hospitalsError,
  isHospitalsLoading,
  refreshHospitals,
  submitHospital
} = useHospital()

const searchQuery = ref('')
const isDialogOpen = ref(false)
const isEditing = ref(false)
const currentHospital = ref<HospitalSchemaType | null>(null)
const locationDisplay = ref('')
const isLoadingLocation = ref(false)
const showMapPicker = ref(false)

const form = ref<HospitalSchemaType>({
  id: undefined,
  name: '',
  phone: '',
  type: '',
  facilities: undefined,
  emergencyServices: false,
  accreditation: undefined,
  website: null,
  openingHours: undefined,
  address: '',
  city: '',
  state: '',
  country: '',
  latitude: 0,
  longitude: 0,
  isClaimable: true,
  claimedBy: undefined,
  verificationStatus: 'pending',
  profileId: undefined
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
  const result = hospitalSchema.safeParse(form.value)
  if (!result.success) {
    const formattedErrors: Record<string, string> = {}
    result.error.errors.forEach((err) => {
      if (err.path) {
        formattedErrors[err.path[0]] = err.message
      }
    })
    errors.value = formattedErrors
    return false
  }
  errors.value = {}
  return true
}

async function handleSubmit() {
  try {
    if (!validateForm()) {
      return
    }

    // Check required fields
    const requiredFields = ['name', 'phone', 'type', 'address', 'city', 'state', 'country', 'latitude', 'longitude'] as const
    const missingFields = requiredFields.filter(field => {
      const value = form.value[field]
      if (typeof value === 'number') {
        return isNaN(value)
      }
      return !value
    })
    
    if (missingFields.length > 0) {
      showToast(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error')
      return
    }

    const formData = new FormData()
    
    // First append all required fields
    requiredFields.forEach(field => {
      const value = form.value[field]
      formData.append(field, value.toString())
    })
    
    // Then append optional fields that have values
    Object.entries(form.value).forEach(([key, value]) => {
      if (!requiredFields.includes(key as any) && value !== undefined) {
        if (typeof value === 'boolean') {
          formData.append(key, value.toString())
        } else if (value !== null && value !== '') {
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
    id: undefined,
    name: '',
    phone: '',
    type: '',
    facilities: undefined,
    emergencyServices: false,
    accreditation: undefined,
    website: null,
    openingHours: undefined,
    address: '',
    city: '',
    state: '',
    country: '',
    latitude: 0,
    longitude: 0,
    isClaimable: true,
    claimedBy: undefined,
    verificationStatus: 'pending',
    profileId: undefined
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
  currentHospital.value = hospital
  form.value = {
    ...hospital,
    emergencyServices: hospital.emergencyServices ?? false,
    isClaimable: hospital.isClaimable ?? true,
    verificationStatus: hospital.verificationStatus ?? 'pending',
    facilities: hospital.facilities ?? undefined,
    accreditation: hospital.accreditation ?? undefined,
    website: hospital.website ?? null,
    openingHours: hospital.openingHours ?? undefined,
    latitude: hospital.latitude ?? 0,
    longitude: hospital.longitude ?? 0,
    claimedBy: hospital.claimedBy ?? undefined,
    profileId: hospital.profileId ?? undefined
  }
  
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
