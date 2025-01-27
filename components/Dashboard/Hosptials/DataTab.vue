
<template>
  <form @submit.prevent="$emit('handle-submit')" class="space-y-6">
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

        <div class="space-y-2">
          <Label for="facilities">Facilities</Label>
          <Input 
            id="facilities" 
            v-model="form.facilities" 
            placeholder="List available facilities"
            :class="{ 'border-red-500': errors.facilities }" 
          />
          <p v-if="errors.facilities" class="text-sm text-red-500">{{ errors.facilities }}</p>
        </div>

        <div class="space-y-2">
          <Label for="accreditation">Accreditation</Label>
          <Input 
            id="accreditation" 
            v-model="form.accreditation" 
            placeholder="Enter accreditation details"
            :class="{ 'border-red-500': errors.accreditation }" 
          />
          <p v-if="errors.accreditation" class="text-sm text-red-500">{{ errors.accreditation }}</p>
        </div>

        <div class="space-y-2">
          <Label for="openingHours">Opening Hours</Label>
          <Input 
            id="openingHours" 
            v-model="form.openingHours" 
            placeholder="e.g., 9 AM - 5 PM"
            :class="{ 'border-red-500': errors.openingHours }" 
          />
          <p v-if="errors.openingHours" class="text-sm text-red-500">{{ errors.openingHours }}</p>
        </div>

        <div class="flex items-center space-x-2">
          <Checkbox 
            id="emergencyServices" 
            v-model="form.emergencyServices"
          />
          <Label for="emergencyServices">24/7 Emergency Services Available</Label>
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
                @click="$emit('get-current-location')"
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
                @click="$emit('toggle-map-picker')"
              >
                <Icon 
                  name="heroicons:map" 
                  class="h-4 w-4 mr-2" 
                />
                {{ showMapPicker ? 'Hide Map' : 'Pick on Map' }}
              </Button>
            </div>
            <div v-if="showMapPicker" class="mt-4">
              <MapPicker @location-picked="$emit('location-picked', $event)" />
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
      <Button type="submit">Next</Button>
    </DialogFooter>
  </form>
</template>

<script setup lang="ts">

import type { HospitalSchemaType } from '@/schemas/hospitals'
import MapPicker from '@/components/Dashboard/MapPicker.vue'
import Map from '@/components/Dashboard/Map.vue'

const props = defineProps<{
  form: HospitalSchemaType
  isEditing: boolean
  errors: Record<string, string>
  activeTab: string
  isLoadingLocation: boolean
  locationDisplay: string
  showMapPicker: boolean
}>()

defineEmits<{
  (e: 'handle-submit'): void
  (e: 'get-current-location'): void
  (e: 'location-picked', location: { lat: number; longi: number }): void
  (e: 'toggle-map-picker'): void
}>()
</script>