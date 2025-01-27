<template>
  <section class="py-16">
    <div class="max-w-7xl p-5 mx-auto bg-[#FFF8EA]">
      <div class="">
     <SearchForm @submit-search="handleSearch" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { SearchParams } from '@/types/search'
const handleSearch = async (form: SearchParams) => {
  await navigateTo({
    path: '/searchresult',
    query: {
      serviceType: form.serviceType,
      latitude: form.latitude,
      longitude: form.longitude,
      maxDistance: form.maxDistance,
      entityType: form.entityType
    }
  })
}
</script>
