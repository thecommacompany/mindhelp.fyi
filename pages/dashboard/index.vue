<template>
  <div class="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50">
    <div class="max-w-7xl">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl  overflow-hidden transition-all duration-300 ">
          <div class="px-6  sm:p-8">
            <div v-if="loggedIn">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div class="space-y-2">
                  <button
                  @click="handleSignOut"
                  class=""
                >
                  Sign Out <Icon name="heroicons:arrow-right-end-on-rectangle" class="w-5 h-5" />
                </button>
                  <h1 class="text-3xl font-display text-gray-900 tracking-tight">Welcome {{ user?.name }}!</h1>
                  <p class="text-sm font-body text-gray-600">
                    Logged in since {{ new Date(session.loggedInAt).toLocaleString() }}
                  </p>
                </div>
             
              </div>
              
              <DashboardNavigationCards />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const { loggedIn, user, session, clear } = useUserSession()
const router = useRouter()

// Check if profile exists and redirect if needed
onMounted(async () => {
  if (loggedIn.value) {
    try {
      const { data: profile } = await useFetch('/api/profile')
      if (!profile.value) {
        await router.push('/dashboard/profile')
      }
    } catch (error) {
      if (error.statusCode === 404) {
        await router.push('/dashboard/profile')
      }
    }
  }
})

// Handle sign out and redirect
const handleSignOut = async () => {
  await clear()
  await router.push('/')
}

// Middleware to protect the page
definePageMeta({
  middleware: 'auth',
  layout: 'dashboard'
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+Pro:wght@400;600&display=swap');

.font-display {
  font-family: 'Inter', sans-serif;
}

.font-body {
  font-family: 'Source Serif Pro', serif;
}

.bg-emarald-50 {
  background-color: #F5F7F5;
}

.bg-sage-600 {
  background-color: #87A987;
}

.hover\:bg-sage-700:hover {
  background-color: #6B8A6B;
}

.bg-cream-50 {
  background-color: #FDFBF7;
}
</style>
