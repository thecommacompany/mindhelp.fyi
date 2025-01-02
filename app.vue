<template>
  <div>
   <NuxtPage /> 
  </div>
</template>
<script setup lang="ts">
import { provideUseId } from '@headlessui/vue'
// Use SSR-safe IDs for Headless UI
provideHeadlessUseId(() => useId())
</script>