<template>
  
      <div class="min-w-sm w-full flex flex-col gap-4 bg-white p-5 shadow-lg rounded-lg">
        <div class="card-header">
          <h3 class="name">{{ result.name }}</h3>
          <span :class="['badge', result.type]">{{ result.type }}</span>
          <span class="text-xs p-2 bg-gray-50 rounded-full">{{$route.query.latitude && $route.query.longitude && result.latitude && result.longitude ? calculateDistance(result.latitude, result.longitude, Number($route.query.latitude), Number($route.query.longitude)).toFixed(2) + ' km' : ''}}</span>
        </div>

        <div class="card-body">
          <div v-if="result.type === 'professional'" class="details">
            <p><Icon name="heroicons:academic-cap" class="icon" /> {{ result.specialization }}</p>
            <p v-if="result.isOnline" class="online">
              <Icon name="heroicons:video-camera" class="icon" /> Available for online consultation
            </p>
          </div>

          <div class="location">
            <Icon name="heroicons:map-pin" class="icon" />
            <span>{{ formatLocation(result) }}</span>
          </div>
          <div class="online" v-if="result.isOnline">
            <Icon name="heroicons:video-camera" class="icon" />
            Available for online consultation
          </div>
          <div class="address flex gap-2" >
            <Icon name="heroicons:building-office-2" class="icon" />
            <span class="text-sm text-gray-600 max-w-[250px]">  {{result.address}}, {{result.city}}, {{result.state}}</span>
          </div>
          <div class="phone flex gap-2" >
            <Icon name="heroicons:phone" class="icon" />
            <span class="text-sm text-gray-600 max-w-[250px]">  {{result.phone}}</span>
          </div>
          <div v-if="result.services" class="services flex gap-2">
            <Icon name="heroicons:clipboard-document-list" class="icon" />
            <span class="text-sm text-gray-600 max-w-[250px]">{{ formatServices(result.services) }}</span>
          </div>

          <div class="verification" v-if="result.verificationStatus">
            <Icon 
              :name="result.verificationStatus === 'verified' ? 'heroicons:check-badge' : 'heroicons:clock'" 
              class="icon"
              :class="result.verificationStatus"
            />
            <span>{{ formatVerificationStatus(result.verificationStatus || 'unverified') }}</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="flex gap-2">
   
            <a v-if="result.phone" :href="`tel:${result.phone}`" class="action-button">
              Call
              <Icon name="heroicons:phone" class="icon" />
            </a>
         
            <button @click="showDetails = true" class="action-button bg-emerald-600 hover:bg-emerald-700">
              <Icon name="heroicons:information-circle" class="icon" />
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- Entity Details Popup -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="showDetails" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/50" @click="showDetails = false"></div>
            
            <!-- Modal -->
            <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md min-h-[50vh] max-h-[90vh] flex flex-col">
              <!-- Close button -->
              <button 
                @click="showDetails = false"
                class="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Icon name="heroicons:x-mark" class="w-6 h-6" />
              </button>

              <!-- Content -->
              <div class="p-6 overflow-y-auto flex-1">
                <!-- Header -->
                <div class="space-y-2 mb-6">
                  <div class="flex items-center gap-3">
                    <h2 class="text-2xl font-semibold text-gray-900">{{ result.name }}</h2>
                    <span :class="['badge', result.type]">{{ result.type }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-gray-600">
                    <Icon name="heroicons:check-badge" v-if="result.verificationStatus === 'verified'" class="w-5 h-5 text-emerald-600" />
                    <span>{{ formatVerificationStatus(result.verificationStatus || 'unverified') }}</span>
                  </div>
                </div>

                <!-- Contact Information - Always Visible -->
                <div class="info-section mb-6">
                  <h3 class="section-title">Contact Information</h3>
                  <div class="space-y-2">
                    <p class="flex items-center gap-2">
                      <Icon name="heroicons:phone" class="w-5 h-5" />
                      <a :href="`tel:${result.phone}`" class="text-emerald-600 hover:underline">
                        {{ result.phone }}
                      </a>
                    </p>
                    <p class="flex items-start gap-2">
                      <Icon name="heroicons:map-pin" class="w-5 h-5 mt-1 flex-shrink-0" />
                      <span>{{ result.address }}, {{ result.city }}, {{ result.state }}</span>
                    </p>
                  </div>
                </div>

                <!-- Expandable Sections -->
                <div class="space-y-2">
                  <!-- Professional Details -->
                  <HeadlessDisclosure v-if="result.type === 'professional'" v-slot="{ open }" as="div" class="disclosure-wrapper">
                    <HeadlessDisclosureButton class="disclosure-button">
                      <span><Icon name="heroicons:academic-cap" class="w-5 h-5" /> Professional Details</span>
                      <Icon 
                        :name="open ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                        class="w-5 h-5"
                      />
                    </HeadlessDisclosureButton>
                    <HeadlessDisclosurePanel class="disclosure-panel">
                      <div class="space-y-4">
                        <div class="info-section">
                          <h3 class="section-title">Specialization</h3>
                          <p class="flex items-center gap-2">
                            <Icon name="heroicons:academic-cap" class="w-5 h-5" />
                            {{ result.specialization }}
                          </p>
                        </div>
                      </div>
                    </HeadlessDisclosurePanel>
                  </HeadlessDisclosure>

                  <!-- Services -->
                  <HeadlessDisclosure v-if="result.services?.length" v-slot="{ open }" as="div" class="disclosure-wrapper">
                    <HeadlessDisclosureButton class="disclosure-button">
                      <span><Icon name="heroicons:clipboard-document-list" class="w-5 h-5" /> Available Services ({{ result.services?.length }})</span>
                      <Icon 
                        :name="open ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                        class="w-5 h-5"
                      />
                    </HeadlessDisclosureButton>
                    <HeadlessDisclosurePanel class="disclosure-panel">
                      <div class="flex flex-wrap gap-2">
                        <span 
                          v-for="service in result.services" 
                          :key="service"
                          class="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-sm"
                        >
                          {{ service }}
                        </span>
                      </div>
                    </HeadlessDisclosurePanel>
                  </HeadlessDisclosure>

                  <!-- Management Status -->
                  <HeadlessDisclosure v-slot="{ open }" as="div" class="disclosure-wrapper">
                    <HeadlessDisclosureButton class="disclosure-button">
                      <span>
                        <Icon name="heroicons:user-circle" class="w-5 h-5" /> Management Status</span>
                      <Icon 
                        :name="open ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
                        class="w-5 h-5"
                      />
                    </HeadlessDisclosureButton>
                    <HeadlessDisclosurePanel class="disclosure-panel">
                      <div class="space-y-2">
                        <p class="flex items-center gap-2">
                          <Icon 
                            :name="result.claimedBy ? 'heroicons:user' : 'heroicons:user-circle'" 
                            class="w-5 h-5" 
                          />
                          {{ result.claimedBy ? 'Managed by owner' : 'Not claimed' }}
                        </p>
                         <!-- Claim Button -->
                  <button 
                    v-if="result.isClaimable && !result.claimedBy"
                    class="action-btn bg-yellow-500 hover:bg-yellow-600"
                  >
                    <Icon name="heroicons:flag" class="w-5 h-5" />
                    <span>Claim Listing</span>
                  </button>
                      </div>
                    </HeadlessDisclosurePanel>
                  </HeadlessDisclosure>
                </div>
              </div>

              <!-- Fixed Footer with Quick Actions -->
              <div class="border-t bg-white p-4 rounded-b-xl">
                <div class="flex flex-wrap gap-3 justify-center">
                  <!-- Phone -->
                  <a 
                    v-if="result.phone"
                    :href="`tel:${result.phone}`" 
                    class="action-btn bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Icon name="heroicons:phone" class="w-5 h-5" />
                    <span>Call</span>
                  </a>

                  <!-- Location -->
                  <a v-if="result.address" 
               :href="generateMapsLink(result)" 
               target="_blank" 
               class="action-btn bg-blue-600 hover:bg-blue-700">
              Address
              <Icon name="heroicons:map" class="icon" />
            </a>
            <a v-if="result.latitude && result.longitude" 
               :href="generateMapsLocationLink(result)" 
               target="_blank" 
               class="action-btn bg-blue-600 hover:bg-blue-700">
              Location
              <Icon name="heroicons:map-pin" class="icon" />
            </a>

                  <!-- Online Consultation -->
                  <button 
                    v-if="result.isOnline"
                    class="action-btn bg-purple-600 hover:bg-purple-700"
                  >
                    <Icon name="heroicons:video-camera" class="w-5 h-5" />
                    <span>Online Consultation</span>
                  </button>

                 
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

</template>

<script setup lang="ts">
import type { SearchParams, SearchResult } from '@/types/search'

const props = defineProps<{
  result: SearchResult
}>()

const showDetails = ref(false)

const formatLocation = (result: SearchResult) => {
  if (!result.city && !result.state) return 'Location not specified'
  return [result.city, result.state].filter(Boolean).join(', ')
}
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}
const formatVerificationStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const formatServices = (services: string[]) => {
  if (!services?.length) return 'No services listed'
  return services.map(s => s.replace(/-/g, ' ')).join(', ')
}

const generateMapsLink = (result: SearchResult) => {
  if (!result.latitude || !result.longitude) return '#'
  return `https://www.google.com/maps/search/?api=1&query=${result.name},${result.address},${result.city},${result.state}`
}
const generateMapsLocationLink = (result: SearchResult) => {
  if (!result.latitude || !result.longitude) return '#'
  return `https://www.google.com/maps/search/?api=1&query=${result.latitude},${result.longitude}`
}
</script>

<style scoped>
.search-results {
  padding: 1rem;
}



.result-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.result-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2D3748;
  margin: 0;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.badge.professional {
  background: #B8C5B0;
  color: #2F3E46;
}

.badge.hospital {
  background: #F7D794;
  color: #2F3E46;
}

.badge.organization {
  background: #E2E8F0;
  color: #2F3E46;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.details, .location, .verification {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4A5568;
}

.online {
  color: #38A169;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.icon.verified {
  color: #38A169;
}

.icon.pending {
  color: #D69E2E;
}

.card-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #E2E8F0;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #FFF8EA;
  color: #2D3748;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s;
  flex: 1;
}

.action-button:hover {
  background: #F7D794;
}

/* Popup Styles */
.section-title {
  @apply text-sm font-medium text-gray-500 mb-2;
}

.info-section {
  @apply p-4 bg-gray-50 rounded-lg;
}

.btn-claim {
  @apply flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg 
         hover:bg-yellow-600 transition-colors w-full justify-center font-medium;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Badge Styles */
.badge {
  @apply px-2 py-1 text-xs font-medium rounded-full;
}
.badge.professional {
  @apply bg-emerald-100 text-emerald-600;
}
.badge.hospital {
  @apply bg-blue-100 text-blue-700;
}
.badge.organization {
  @apply bg-purple-100 text-purple-700;
}

/* Disclosure Styles */
.disclosure-wrapper {
  @apply rounded-lg overflow-hidden border border-gray-200;
}

.disclosure-button {
  @apply w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors;
}

.disclosure-panel {
  @apply p-4 bg-white;
}

/* Action Buttons */
.action-btn {
  @apply flex items-center gap-2 px-4 py-2 text-white rounded-lg font-medium transition-colors;
}
</style>