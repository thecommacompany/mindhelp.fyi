<template>
<div class="min-h-[45vh]">
  <div class="p-3 bg-[#FFF8EA]">
    <SearchForm :initialValues="getSearchParamsFromURL()" :initialLocation="getInitialLocation()" @submit-search="handleSearchSubmit" />
  </div>
  <div class="mt-4 p-3">
    <div v-if="isLoading">Loading...</div>
  <div v-else-if="error" class="text-center p-2 bg-[#FFF8EA] rounded-md text-red-500">Error: {{ error }}</div>
  <div v-else>
    <div v-if="(results?.data || []).length > 0" class="flex gap-5 flex-wrap justify-center">
      <div v-for="result in results?.data || []" :key="result.id" class="max-w-sm w-full" >

        <SearchResult :result="result"  />
      </div>
      
    </div>
    <div v-else>
      <p>No results found.</p>
    </div>
  

  </div>


  </div>
  </div>
</template>
<script setup lang="ts"> 
import type { SearchParams, SearchResult } from '@/types/search'



const isInitialLoad = ref(true)  // Flag to track initial load

// get search params
const route = useRoute()
const router = useRouter()
// Extract search params from URL
const getSearchParamsFromURL = (): SearchParams => {
  const { query } = route
  
  return {
    serviceType: query.serviceType as string,
    entityType: query.entityType as string,
    maxDistance: query.maxDistance as string,
    latitude: query.latitude ? Number(query.latitude) : undefined,
    longitude: query.longitude ? Number(query.longitude) : undefined,
  }
  
}
const getInitialLocation = () => {
  const { latitude, longitude } = getSearchParamsFromURL()
  return latitude && longitude ? { latitude, longitude, display: '' } : undefined
}

// handle search

const {handleSearch, results, isLoading, error} = useSearch()

const handleSearchSubmit = (searchForm: SearchParams) => {

  isInitialLoad.value = false  // Mark that this is a manual search
  let inputParams = {} as any
  Object.entries(searchForm).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      inputParams[key] = value
    }
  })
  router.push({
    query: inputParams
  })
  handleSearch(searchForm)
  // do something with searchParams
  console.log(results.value)
}
watchEffect(() => {
  const searchParams = getSearchParamsFromURL()
  const hasValidParams = Object.values(searchParams).some(
    value => value !== undefined && value !== ''
  )

  if (isInitialLoad.value && hasValidParams) {
    // Only perform search on initial load with parameters
    handleSearch(searchParams)
    console.log(searchParams)
    isInitialLoad.value = false
  }
  // Route changes after initial load won't trigger automatic search
})

definePageMeta({
  title: 'Search Result',
  description: 'Search result page'
})
</script>