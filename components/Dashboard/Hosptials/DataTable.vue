<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-3xl font-bold tracking-tight">Hospitals</h2>
      <Button @click="$emit('open-create-dialog')">Add Hospital</Button>
    </div>

    <div class="flex items-center py-4">
      <Input
        placeholder="Search hospitals..."
        class="max-w-sm"
        v-model="searchQuery"
      />
    </div>

    <div v-if="isHospitalsLoading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-500"></div>
    </div>

    <div v-else-if="hospitalsError" class="text-red-500 text-center py-12">
      {{ hospitalsError }}
      <Button 
        @click="$emit('refresh-hospitals')" 
        class="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
      >
        Try Again
      </Button>
    </div>

    <div v-else-if="!filteredHospitals?.length" class="text-center py-12 text-gray-500">
      No hospitals found. Click "Add Hospital" to create one.
    </div>

    <div v-else class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Emergency Services</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="hospital in filteredHospitals" :key="hospital?.id">
            <TableCell>{{ hospital?.name || '-' }}</TableCell>
            <TableCell>{{ hospital?.type || '-' }}</TableCell>
            <TableCell>{{ hospital?.phone || '-' }}</TableCell>
            <TableCell>{{ hospital?.city ? `${hospital.city}, ${hospital.state || ''}` : '-' }}</TableCell>
            <TableCell>{{ hospital?.emergencyServices ? 'Available' : 'Not Available' }}</TableCell>
            <TableCell>
              <Badge :variant="getStatusVariant(hospital?.verificationStatus || '')">
                {{ hospital?.verificationStatus || 'pending' }}
              </Badge>
            </TableCell>
            <TableCell>
              <div class="flex items-center gap-2">
                <Button variant="ghost" size="icon" @click="$emit('edit-hospital', hospital)">
                  <Icon name="heroicons:pencil" class="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" @click="$emit('delete-hospital', hospital)">
                  <Icon name="heroicons:trash" class="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { HospitalSchemaType } from '@/schemas/hospitals'

const props = defineProps<{
  hospitals: HospitalSchemaType[]
  hospitalsError: string | null
  isHospitalsLoading: boolean
}>()

defineEmits<{
  (e: 'edit-hospital', hospital: HospitalSchemaType): void
  (e: 'delete-hospital', hospital: HospitalSchemaType): void
  (e: 'refresh-hospitals'): void
  (e: 'open-create-dialog'): void
}>()

const searchQuery = ref('')

const filteredHospitals = computed(() => {
  if (!props.hospitals) return []
  if (!searchQuery.value) return props.hospitals

  const query = searchQuery.value.toLowerCase()
  return props.hospitals.filter(hospital => 
    hospital.name?.toLowerCase().includes(query) ||
    hospital.type?.toLowerCase().includes(query) ||
    hospital.city?.toLowerCase().includes(query) ||
    hospital.state?.toLowerCase().includes(query)
  )
})

const getStatusVariant = (status: string): "default" | "destructive" | "secondary" | "outline" => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'default'
    case 'rejected':
      return 'destructive'
    case 'pending':
      return 'secondary'
    default:
      return 'outline'
  }
}
</script>