<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-cream-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 transition-all duration-300 ease-in-out">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 transform hover:shadow-xl transition-all duration-300">
        <div class="text-center space-y-6">
          <h2 class="text-3xl font-display text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p class="text-base font-body text-gray-600">
            Sign in to continue your journey
          </p>
        </div>
        <div class="mt-8 space-y-6">
          <div>
            <a href="/api/_auth/google" 
               class="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-xl text-base font-medium text-white bg-sage-600 hover:bg-sage-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg">
              <Icon name="logos:google-icon" class="w-5 h-5 mr-3" />
              Continue with Google
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { loggedIn } = useUserSession()
const route=useRoute()
// Redirect to dashboard if already logged in
watchEffect(() => {
  if (loggedIn.value) {
    const { redirect } = route.query
    if (redirect) {
      navigateTo(redirect)
    }else{
      navigateTo('/dashboard')
    }
  }
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
