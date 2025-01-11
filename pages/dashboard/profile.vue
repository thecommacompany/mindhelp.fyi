<template>
  <div class="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50">
    <div class="max-w-3xl mx-auto py-8 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden relative">
          <div v-if="formData.isVerified" class="absolute top-4 right-4 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Icon name="heroicons:check-badge" class="w-5 h-5" />
            Verified
          </div>
          <div v-else class="absolute top-4 right-4 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Icon name="heroicons:clock" class="w-5 h-5" />
            Verification Pending
          </div>
          <div class="px-6 py-8 sm:p-8">
            <h1 class="text-3xl font-display text-gray-900 tracking-tight mb-8">Complete Your Profile</h1>
            
            <div v-if="isProfileLoading" class="flex justify-center py-12">
              <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-500"></div>
            </div>
            
            <div v-else-if="profileError" class="text-red-500 text-center py-12">
              {{ profileError }}
              <button 
                @click="refreshProfile" 
                class="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
              >
                Try Again
              </button>
            </div>

            <form v-else @submit.prevent="handleSubmit" class="space-y-8">
              <div class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-emerald-600 mb-2">Full Name</label>
                  <div class="relative">
                    <input 
                      type="text" 
                      id="name" 
                      v-model="formData.name" 
                      required
                      placeholder="Enter your full name"
                      class="w-full px-6 py-4 text-lg rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 transition-all pl-12"
                    />
                    <Icon name="heroicons:user" class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                  </div>
                  <p v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-emerald-600 mb-2">Role</label>
                  <Listbox v-model="formData.role">
                    <div class="relative">
                      <ListboxButton class="w-full px-6 py-4 text-lg rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 transition-all pl-12 text-left">
                        <Icon name="heroicons:briefcase" class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                        <span>{{ availableRoles.find(r => r.id === formData.role)?.name }}</span>
                        <Icon name="heroicons:chevron-up-down" class="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                      </ListboxButton>
                      <transition
                        leave-active-class="transition duration-100 ease-in"
                        leave-from-class="opacity-100"
                        leave-to-class="opacity-0"
                      >
                        <ListboxOptions class="absolute z-10 mt-1 w-full bg-white rounded-xl border-2 border-emerald-100 shadow-lg max-h-60 overflow-auto focus:outline-none">
                          <ListboxOption
                            v-for="role in availableRoles"
                            :key="role.id"
                            :value="role.id"
                            v-slot="{ active, selected }"
                          >
                            <div
                              :class="[
                                active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                                'relative cursor-pointer select-none py-3 px-6'
                              ]"
                            >
                              <span :class="[selected ? 'font-medium' : 'font-normal']">
                                {{ role.name }}
                              </span>
                              <span
                                v-if="selected"
                                :class="[
                                  active ? 'text-emerald-600' : 'text-emerald-500',
                                  'absolute inset-y-0 right-6 flex items-center'
                                ]"
                              >
                                <Icon name="heroicons:check" class="h-5 w-5" />
                              </span>
                            </div>
                          </ListboxOption>
                        </ListboxOptions>
                      </transition>
                    </div>
                  </Listbox>
                  <p v-if="errors.role" class="text-red-500 text-sm">{{ errors.role }}</p>
                </div>

                <div>
                  <label for="phone" class="block text-sm font-medium text-emerald-600 mb-2">Phone Number</label>
                  <div class="relative">
                    <input 
                      type="tel" 
                      id="phone" 
                      v-model="formData.phone"
                      placeholder="Enter your phone number"
                      class="w-full px-6 py-4 text-lg rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 transition-all pl-12"
                    />
                    <Icon name="heroicons:phone" class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                  </div>
                  <p v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone }}</p>
                </div>

                <div>
                  <label for="bio" class="block text-sm font-medium text-emerald-600 mb-2">Bio</label>
                  <div class="relative">
                    <textarea 
                      id="bio" 
                      v-model="formData.bio"
                      rows="3"
                      placeholder="Tell us about yourself"
                      class="w-full px-6 py-4 text-lg rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 transition-all pl-12"
                    ></textarea>
                    <Icon name="heroicons:document-text" class="absolute left-4 top-8 text-emerald-600 w-5 h-5" />
                  </div>
                  <p v-if="errors.bio" class="text-red-500 text-sm">{{ errors.bio }}</p>
                </div>

                <div>
                  <label for="address" class="block text-sm font-medium text-emerald-600 mb-2">Address</label>
                  <div class="relative">
                    <input 
                      type="text" 
                      id="address" 
                      v-model="formData.address"
                      placeholder="Your address"
                      class="w-full px-6 py-4 text-lg rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 transition-all pl-12"
                    />
                    <Icon name="heroicons:home" class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                  </div>
                  <p v-if="errors.address" class="text-red-500 text-sm">{{ errors.address }}</p>
                </div>

                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label for="city" class="block text-sm font-medium text-emerald-600 mb-2">City</label>
                    <div class="relative">
                      <input 
                        type="text" 
                        id="city" 
                        v-model="formData.city"
                        placeholder="Your city"
                        class="w-full px-6 py-4 text-lg rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 transition-all pl-12"
                      />
                      <Icon name="heroicons:building-office-2" class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                    </div>
                    <p v-if="errors.city" class="text-red-500 text-sm">{{ errors.city }}</p>
                  </div>

                  <div>
                    <label for="state" class="block text-sm font-medium text-emerald-600 mb-2">State</label>
                    <div class="relative">
                      <input 
                        type="text" 
                        id="state" 
                        v-model="formData.state"
                        placeholder="Your state"
                        class="w-full px-6 py-4 text-lg rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 transition-all pl-12"
                      />
                      <Icon name="heroicons:map" class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                    </div>
                    <p v-if="errors.state" class="text-red-500 text-sm">{{ errors.state }}</p>
                  </div>
                </div>

                <div>
                  <label for="country" class="block text-sm font-medium text-emerald-600 mb-2">Country</label>
                  <div class="relative">
                    <input 
                      type="text" 
                      id="country" 
                      v-model="formData.country"
                      placeholder="Your country"
                      class="w-full px-6 py-4 text-lg rounded-xl border-2 border-emerald-100 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 transition-all pl-12"
                    />
                    <Icon name="heroicons:globe-alt" class="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />
                  </div>
                  <p v-if="errors.country" class="text-red-500 text-sm">{{ errors.country }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-emerald-600 mb-2">Profile Picture</label>
                  <div class="mt-1 flex items-center space-x-4">
                    <div v-if="imagePreview || formData.photoUrl" class="h-24 w-24 rounded-xl overflow-hidden bg-emerald-50 border-2 border-emerald-100">
                      <img :src="imagePreview || formData.photoUrl" alt="Profile preview" class="h-full w-full object-cover" />
                    </div>
                    <div v-else class="h-24 w-24 rounded-xl overflow-hidden bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center">
                      <Icon name="heroicons:user-circle" class="w-12 h-12 text-emerald-300" />
                    </div>
                    <input
                      type="file"
                      ref="fileInput"
                      accept="image/*"
                      class="hidden"
                      @change="handleImageChange"
                    />
                    <button
                      type="button"
                      @click="$refs.fileInput.click()"
                      class="px-6 py-4 text-base font-medium text-emerald-600 bg-emerald-50 border-2 border-emerald-100 rounded-xl hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all"
                    >
                      {{ imageFile ? 'Change Picture' : 'Upload Picture' }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="flex justify-end">
                <button
                  type="submit"
                  class="px-8 py-4 text-lg font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { profileSchema } from '~/schemas/profiles'
import { useProfile } from '~/composables/useProfile'

const {
  profile,
  profileStatus,
  profileError,
  isProfileLoading,
  isPending,
  refreshProfile,
  submitProfile
} = useProfile()

const errors = ref({})
const imagePreview = ref(null)

const formData = reactive({
  name: profile.value?.data?.name || '',
  role: profile.value?.data?.role || 'user',
  phone: profile.value?.data?.phone || '',
  photoUrl: profile.value?.data?.photoUrl || '',
  isVerified: profile.value?.data?.isVerified || false
})

// Watch for profile changes to update form data
watch(() => profile.value?.data, (newProfile) => {
  if (newProfile) {
    formData.name = newProfile.name || ''
    formData.role = newProfile.role || 'user'
    formData.phone = newProfile.phone || ''
    formData.photoUrl = newProfile.photoUrl || ''
    formData.isVerified = newProfile.isVerified || false
  }
}, { immediate: true })

const validateForm = () => {
  try {
    // Remove photoUrl from validation if it's empty
    const dataToValidate = { ...formData }
    if (!dataToValidate.photoUrl) {
      delete dataToValidate.photoUrl
    }
    
    const result = profileSchema.safeParse(dataToValidate)
    if (!result.success) {
      errors.value = result.error.flatten().fieldErrors
      console.log('Validation errors:', errors.value)
      return false
    }
    errors.value = {}
    return true
  } catch (error) {
    console.error('Validation error:', error)
    return false
  }
}

const handleSubmit = async () => {
  try {
    if (!validateForm()) {
      return
    }

    const formDataObj = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formDataObj.append(key, value)
      }
    })
    
    if (imageFile.value) {
      formDataObj.append('picture', imageFile.value, imageFile.value.name)
    }

    const { success, error } = await submitProfile(formDataObj)
    
    if (success) {
      console.log('Profile updated successfully')
    } else {
      console.log('Failed to save profile:', error)
    }
  } catch (error) {
    console.error('Failed to update profile:', error)
  }
}

const availableRoles = [
  { id: 'user', name: 'User' },
  { id: 'professional', name: 'Professional' },
  { id: 'hospital', name: 'Hospital' },
  { id: 'organization', name: 'Organization' },
]

const imageFile = ref(null)

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      console.log('Image size should be less than 2MB')
      return
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Please select an image file')
      return
    }

    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})
</script>