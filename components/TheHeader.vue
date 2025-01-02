<template>
  <header class="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
    <nav class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-emerald-800">MindHelp.fyi</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <LocationSearch />
          <NuxtLink to="/find-help" class="text-gray-600 hover:text-emerald-700 transition-colors">Find Help</NuxtLink>
          <NuxtLink to="/resources" class="text-gray-600 hover:text-emerald-700 transition-colors">Resources</NuxtLink>
          <NuxtLink to="/emergency" class="text-red-600 hover:text-red-700 transition-colors font-medium">Emergency</NuxtLink>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 rounded-lg hover:bg-gray-100">
          <span class="sr-only">Open menu</span>
          <div class="w-6 h-6 flex flex-col justify-around">
            <span class="block w-full h-0.5 bg-gray-600 transition-transform" :class="{ 'rotate-45 translate-y-1.5': isMenuOpen }"></span>
            <span class="block w-full h-0.5 bg-gray-600" :class="{ 'opacity-0': isMenuOpen }"></span>
            <span class="block w-full h-0.5 bg-gray-600 transition-transform" :class="{ '-rotate-45 -translate-y-1.5': isMenuOpen }"></span>
          </div>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-show="isMenuOpen" class="md:hidden">
        <div class="py-4 space-y-4">
          <LocationSearch class="mb-4" />
          <NuxtLink to="/find-help" class="block px-4 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg">Find Help</NuxtLink>
          <NuxtLink to="/resources" class="block px-4 py-2 text-gray-600 hover:bg-emerald-50 rounded-lg">Resources</NuxtLink>
          <NuxtLink to="/emergency" class="block px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium">Emergency</NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const isMenuOpen = ref(false)
</script>
