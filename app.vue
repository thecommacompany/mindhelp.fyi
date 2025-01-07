<template>
  <div class="">
    <NuxtLayout >
   <NuxtPage /> 
   </NuxtLayout>
  </div>
</template>
<script setup lang="ts">

// Use SSR-safe IDs for Headless UI
provideHeadlessUseId(() => useId())
</script>