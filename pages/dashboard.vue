<template>
  <div class="min-h-screen bg-gradient-to-br from-sage-50 to-cream-50">
    <div class="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div class="px-6 py-8 sm:p-8">
            <div v-if="loggedIn">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div class="space-y-2">
                  <h1 class="text-3xl font-display text-gray-900 tracking-tight">Welcome {{ user?.name }}!</h1>
                  <p class="text-sm font-body text-gray-600">
                    Logged in since {{ new Date(session.loggedInAt).toLocaleString() }}
                  </p>
                </div>
                <button
                  @click="handleSignOut"
                  class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-yellow-500 hover:bg-yellow-600 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Out
                </button>
              </div>
              
              <div class="mt-10">
                <h2 class="text-2xl font-display text-gray-900 tracking-tight">Your Profile</h2>
                <div class="mt-6 bg-emarald-50/50 rounded-xl p-6">
                  <dl class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                    <div class="sm:col-span-1">
                      <dt class="text-sm font-medium font-display text-gray-600">Email Address</dt>
                      <dd class="mt-2 text-base font-body text-gray-900">{{ user?.email }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { loggedIn, user, session, clear } = useUserSession()
const router = useRouter()

// Handle sign out and redirect
const handleSignOut = async () => {
  await clear()
  router.push('/')
}

// Middleware to protect the page
definePageMeta({
  middleware: 'auth'
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
