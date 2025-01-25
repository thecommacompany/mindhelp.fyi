<template>

    <div class="flex items-center justify-between mb-4">
          <h2 class="text-3xl font-bold tracking-tight">Professionals</h2>
          <Button @click="$emit('openCreateDialog')">Add Professional</Button>
        </div>
    
        <div class="flex items-center py-4">
          <Input
            v-model="searchQuery"
            placeholder="Search professionals..."
            class="max-w-sm"
          />
        </div>
    
        <div v-if="isProfessionalsLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-500"></div>
        </div>
    
        <div v-else-if="professionalsError" class="text-red-500 text-center py-12">
          {{ professionalsError }}
          <Button 
            @click="$emit('refreshProfessionals')" 
            class="mt-4 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
          >
            Try Again
        </Button>
        </div>
    
        <div v-else class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
               
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Specialization</TableHead>
                <TableHead>Qualifications</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="professional in filteredProfessionals" :key="professional.profileId">
                <TableCell>{{ professional.name }}</TableCell>
                <TableCell>{{ professional.phone }}</TableCell>
                <TableCell>{{ professional.specialization }}</TableCell>
                <TableCell>{{ professional.qualifications }}</TableCell>
                <TableCell>{{ professional.experience }} years</TableCell>
                <TableCell>
                  <Badge :variant="getStatusVariant(professional.verificationStatus)">
                    {{ professional.verificationStatus }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" @click="$emit('editProfessional', professional.id)">
                    <Icon name="heroicons:pencil" class="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" @click="$emit('deleteProfessional', professional)">
                    <Icon name="heroicons:trash" class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
    
    </template>
    
    <script setup lang="ts">
    import type {ProfessionalSchemaType} from '@/schemas/professionals'
    const props = defineProps({
      professionals: {
        type: Object,
        required: true,
      },
      isProfessionalsLoading: {
        type: Boolean,
        required: true,
      },
      professionalsError: {
        type: String,
        required: false,
      },
    });
    defineEmits(['openCreateDialog', 'editProfessional', 'deleteProfessional', 'refreshProfessionals'])
    const searchQuery = ref('')
    const filteredProfessionals = computed(() => {
  if (!props.professionals?.data) return []

  return props.professionals.data.filter((professional: ProfessionalSchemaType) => 
    professional.specialization?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.qualifications?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    professional.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
function getStatusVariant(status: string): "default" | "destructive" | "secondary" | "outline" {
  switch (status) {
    case 'verified':
      return 'default'
    case 'pending':
      return 'secondary'
    case 'rejected':
      return 'destructive'
    default:
      return 'outline'
  }
}
    </script>