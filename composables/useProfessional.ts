import { defineQuery, useQuery, useMutation } from '@pinia/colada'
import { professionalSchema } from '@/schemas/professionals'
import { z } from 'zod'

export type ProfessionalFormData = z.infer<typeof professionalSchema>

export const professionalFormSchema = professionalSchema.pick({
  name: true,
  specialization: true,
  qualifications: true,
  licenseNumber: true,
  experience: true,
  consultationFees: true,
  availableForOnline: true,
  languages: true,
  address: true,
  city: true,
  state: true,
  country: true,
  latitude: true,
  longitude: true,
  isClaimable: true,
  claimedBy: true,
  verificationStatus: true
})

export const useProfessional = defineQuery(() => {
  const fetch = useRequestFetch()

  // Get all professionals for the current user
  const { 
    state: professionals, 
    asyncStatus: professionalsStatus,
    error: professionalsError,
    isLoading: isProfessionalsLoading,
    isPending: isProfessionalsPending,
    refresh: refreshProfessionals,
    refetch: refetchProfessionals,
    ...queryRest 
  } = useQuery({
    key: ['professionals'],
    query: async () => {
      const response = await fetch('/api/professionals')
      return response
    }
  })

  // Get a single professional by ID
  const getProfessionalById = (id: string) => {
    return useQuery({
      key: () => ['professionals', id],
      query: async () => {
        const response = await fetch(`/api/professionals/${id}`)
        return response
      },
      enabled: !!id // Only run the query if we have an ID
    })
  }

  const validateFormData = (formData: FormData): { data?: any; error?: z.ZodError } => {
    const dataObject = {
      name: formData.get('name'),
      phone: formData.get('phone') || null,
      specialization: formData.get('specialization'),
      qualifications: formData.get('qualifications'),
      licenseNumber: formData.get('licenseNumber') || null,
      experience: formData.get('experience') ? Number(formData.get('experience')) : null,
      consultationFees: formData.get('consultationFees') ? Number(formData.get('consultationFees')) : null,
      availableForOnline: formData.get('availableForOnline') === 'true',
      languages: formData.get('languages'),
      address: formData.get('address') || null,
      city: formData.get('city') || null,
      state: formData.get('state') || null,
      country: formData.get('country') || null,
      latitude: formData.get('latitude') ? Number(formData.get('latitude')) : null,
      longitude: formData.get('longitude') ? Number(formData.get('longitude')) : null,
      isClaimable: formData.get('isClaimable') === 'true',
      claimedBy: formData.get('claimedBy') || null,
      verificationStatus: formData.get('verificationStatus') || 'pending'
    }

    const result = professionalFormSchema.safeParse(dataObject)
    if (!result.success) {
      return { error: result.error }
    }
    return { data: result.data }
  }

  const { mutate: createProfessional, state: createState } = useMutation({
    key: ['professionals', 'create'],
    mutation: async (data: { formData: FormData }) => {
      const validationResult = validateFormData(data.formData)
      if (validationResult.error) {
        throw new Error('Invalid form data')
      }
      
      const response = await fetch('/api/professionals', {
        method: 'POST',
        body: data.formData
      })
      await refetchProfessionals()
      return response
    }
  })

  const { mutate: updateProfessional, state: updateState } = useMutation({
    key: ['professionals', 'update'],
    mutation: async (data: { id: string, formData: FormData }) => {
      const validationResult = validateFormData(data.formData)
      if (validationResult.error) {
        throw new Error('Invalid form data')
      }

      const response = await fetch(`/api/professionals/${data.id}`, {
        method: 'PATCH',
        body: data.formData
      })
      await refetchProfessionals()
      return response
    }
  })

  const { mutate: deleteProfessional, state: deleteState } = useMutation({
    key: ['professionals', 'delete'],
    mutation: async (data: { id: string }) => {
      const response = await fetch(`/api/professionals/${data.id}`, {
        method: 'DELETE'
      })
      await refetchProfessionals()
      return response
    }
  })

  const submitProfessional = async (
    formData: FormData, 
    method: 'POST' | 'PATCH' | 'DELETE' = 'POST'
  ): Promise<{ success: boolean; error?: string; data?: any }> => {
    try {
      // Only validate form data for POST and PATCH
      if (method !== 'DELETE') {
        const validationResult = validateFormData(formData)
        if (validationResult.error) {
          return { 
            success: false, 
            error: validationResult.error.errors.map(e => e.message).join(', ')
          }
        }
      }

      switch (method) {
        case 'PATCH': {
          const id = formData.get('id')?.toString()
          if (!id) throw new Error('ID is required for update')
          formData.delete('id')
          const response = await updateProfessional({ id, formData })
          return { success: true, data: response }
        }
        case 'DELETE': {
          const id = formData.get('id')?.toString()
          if (!id) throw new Error('ID is required for delete')
          const response = await deleteProfessional({ id })
          return { success: true, data: response }
        }
        default: {
          const response = await createProfessional({ formData })
          return { success: true, data: response }
        }
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to submit professional profile'
      }
    }
  }

  return {
    professionals,
    professionalsStatus,
    professionalsError,
    getProfessionalById,
    isProfessionalsLoading,
    isProfessionalsPending,
    refreshProfessionals,
    refetchProfessionals,
    ...queryRest,
    createState,
    updateState,
    deleteState,
    submitProfessional
  }
})
