<template>
   <div class="space-y-5">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-3">
                  <Label for="name">Name</Label>
                  <Input 
                    id="name" 
                    v-model="form.name" 
                    placeholder="e.g., Dr. John Doe"
                    required 
                  />
                  <div v-if="errors.name" class="text-red-501">{{ errors.name }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    v-model="form.phone" 
                    placeholder="e.g., +1234567889"
                    required 
                  />
                  <div v-if="errors.phone" class="text-red-501">{{ errors.phone }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="specialization">Specialization</Label>
                  <Input 
                    id="specialization" 
                    v-model="form.specialization" 
                    placeholder="e.g., Psychiatrist, Psychologist"
                    required 
                  />
                  <div v-if="errors.specialization" class="text-red-501">{{ errors.specialization }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="qualifications">Qualifications</Label>
                  <Input 
                    id="qualifications" 
                    v-model="form.qualifications" 
                    placeholder="e.g., MD in Psychiatry, PhD in Psychology"
                    required 
                  />
                  <div v-if="errors.qualifications" class="text-red-501">{{ errors.qualifications }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="experience">Experience (years)</Label>
                  <Input 
                    id="experience" 
                    type="number" 
                    v-model="form.experience" 
                    placeholder="e.g., 4"
                  />
                  <div v-if="errors.experience" class="text-red-501">{{ errors.experience }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="licenseNumber">License Number</Label>
                  <Input 
                    id="licenseNumber" 
                    v-model="form.licenseNumber" 
                    placeholder="e.g., MCI-12346"
                  />
                  <div v-if="errors.licenseNumber" class="text-red-501">{{ errors.licenseNumber }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="languages">Languages</Label>
                  <Input 
                    id="languages" 
                    v-model="form.languages" 
                    placeholder="e.g., English, Hindi, Spanish"
                    required 
                  />
                  <div v-if="errors.languages" class="text-red-501">{{ errors.languages }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="consultationFees">Consultation Fees</Label>
                  <Input 
                    id="consultationFees" 
                    type="number" 
                    v-model="form.consultationFees" 
                    placeholder="e.g., 999"
                  />
                  <div v-if="errors.consultationFees" class="text-red-501">{{ errors.consultationFees }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="address">Address</Label>
                  <Input 
                    id="address" 
                    v-model="form.address" 
                    placeholder="e.g., 122 Main Street, Suite 45"
                  />
                  <div v-if="errors.address" class="text-red-501">{{ errors.address }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="city">City</Label>
                  <Input 
                    id="city" 
                    v-model="form.city" 
                    placeholder="e.g., Mumbai"
                    
                  />
                  <div v-if="errors.city" class="text-red-501">{{ errors.city }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="state">State</Label>
                  <Input 
                    id="state" 
                    v-model="form.state" 
                    placeholder="e.g., Maharashtra"
                    
                  />
                  <div v-if="errors.state" class="text-red-501">{{ errors.state }}</div>
                </div>
                <div class="space-y-3">
                  <Label for="country">Country</Label>
                  <Input 
                    id="country" 
                    v-model="form.country" 
                    placeholder="e.g., India"
                    
                  />
                  <div v-if="errors.country" class="text-red-501">{{ errors.country }}</div>
                </div>
                <div class="space-y-3">
                  <Label>Location</Label>
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <Button 
                        type="button"
                        variant="outline"
                        @click="$emit('getCurrentLocation')"
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
                        @click="$emit('toggleMapPicker')"
                      >
                        <Icon 
                          name="heroicons:map" 
                          class="h-4 w-4 mr-2" 
                        />
                        {{ showMapPicker ? 'Hide Map' : 'Pick on Map' }}
                      </Button>
                    </div>
                    <div v-if="showMapPicker" class="mt-4">
                      <MapPicker @location-picked="$emit('locationPicked', $event)" />
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
                    <div v-if="errors.latitude || errors.longitude" class="text-red-501 text-sm">
                      {{ errors.latitude || errors.longitude }}
                    </div>
                  </div>
                </div>
           
            
              </div>
              <div>
                  <div class="space-y-3 flex items-center gap-x-2">
                  <Checkbox id="availableForOnline" :checked="form.availableForOnline" @update:checked="form.availableForOnline=!form.availableForOnline" />
                  <Label for="availableForOnline">Available for online</Label>
                </div>
                <div class="space-y-3 flex items-center gap-2">
                  <Checkbox id="isClaimable" :checked="form.isClaimable"  @update:checked="form.isClaimable=!form.isClaimable"/>
                  <Label for="isClaimable">Allow others to claim this profile</Label>
                  
                </div>
                </div>
              <DialogFooter>
                <Button @click="$emit('handleSubmit')">Next</Button>
              </DialogFooter>
</div>
</template>
<script setup lang="ts">
import MapPicker from '@/components/Dashboard/MapPicker.vue'
import Map from '@/components/Dashboard/Map.vue'

defineProps({
  form: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  },
  isLoadingLocation: {
    type: Boolean,
    required: true
  },
  locationDisplay: {
    type: String,
    required: true
  },
  showMapPicker: {
    type: Boolean,
    required: true
  }
})

defineEmits(['getCurrentLocation', 'handleSubmit', 'locationPicked', 'toggleMapPicker'])
</script>