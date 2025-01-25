import { defineQuery, useQuery, useMutation } from '@pinia/colada'
import { computed } from 'vue'
import type { SearchParams, SearchResult, EntityType } from '~/types/search'

// Type guard to check if a string is a valid EntityType
const isValidEntityType = (type: string): type is EntityType => {
  return ['professional', 'hospital', 'organization', 'support-group'].includes(type)
}

// Transform API response to match SearchResult type
const transformResult = (result: any): SearchResult => {
  if (!isValidEntityType(result.type)) {
    throw new Error(`Invalid entity type: ${result.type}`)
  }
  return {
    ...result,
    type: result.type as EntityType
  }
}

export const useSearch = defineQuery(() => {
  const fetch=useRequestFetch()
  // Store the latest search parameters
  const currentParams = ref<SearchParams | null>(null)

  const { state, isLoading, error, refetch } = useQuery({
    key: computed(() => ['search', JSON.stringify(currentParams.value || {})]),
    query: async () => {
      // If no params set yet, return empty array
      if (!currentParams.value) return [] as SearchResult[]

      const searchParams = new URLSearchParams()
      const params = currentParams.value

      if (params.serviceType) {
        searchParams.append('serviceType', params.serviceType)
      }
      if (params.latitude) {
        searchParams.append('latitude', params.latitude.toString())
      }
      if (params.longitude) {
        searchParams.append('longitude', params.longitude.toString())
      }
      if (params.entityType) {
        searchParams.append('entityType', params.entityType)
      }
      if (params.maxDistance) {
        searchParams.append('maxDistance', params.maxDistance.toString())
      }
      console.log(searchParams)
      const response = await fetch(`/api/frontend/search`, {
        method: 'GET',
        query: Object.fromEntries(searchParams)
      })
      console.log(response)
      if (!response.results) {
        throw new Error('Search failed')
      }
      return response.results.map(transformResult)
    },
    enabled: false,
  })

  const handleSearch = async (params: SearchParams) => {
    console.log(params)
    currentParams.value = params
    return refetch()
  }

  return {
    results: state,
    isLoading,
    error,
    handleSearch
  }
})