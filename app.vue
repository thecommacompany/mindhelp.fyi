<template>
  <div class="">
    <NuxtLayout >
   <NuxtPage /> 
   </NuxtLayout>
   <Toast />
  </div>
</template>
<script setup lang="ts">

// Use SSR-safe IDs for Headless UI
provideHeadlessUseId(() => useId())
</script>