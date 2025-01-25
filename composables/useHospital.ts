import { defineQuery, useQuery, useMutation } from '@pinia/colada'
import { hospitalSchema, type HospitalSchemaType } from '@/schemas/hospitals'
import { z } from 'zod'

export type HospitalFormData = HospitalSchemaType

export const useHospital = defineQuery(() => {
  const fetch = useRequestFetch()

  // Get all hospitals for the current user
  const { 
    state: hospitals, 
    asyncStatus: hospitalsStatus,
    error: hospitalsError,
    isLoading: isHospitalsLoading,
    isPending: isHospitalsPending,
    refresh: refreshHospitals,
    refetch: refetchHospitals,
    ...queryRest 
  } = useQuery({
    key: ['hospitals'],
    query: async () => {
      const response = await fetch('/api/hospitals')
      return response
    }
  })

  // Get a single hospital by ID
  const getHospitalById = async (id: string) => {
    const response = await fetch(`/api/hospitals/${id}`)
    return response
  }

  const validateFormData = (formData: FormData): { data?: any; error?: z.ZodError } => {
    const dataObject = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      type: formData.get('type'),
      facilities: formData.get('facilities') || undefined,
      emergencyServices: formData.get('emergencyServices') === 'true',
      accreditation: formData.get('accreditation') || undefined,
      website: formData.get('website') || '',
      openingHours: formData.get('openingHours') || undefined,
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      country: formData.get('country'),
      latitude: formData.get('latitude') ? Number(formData.get('latitude')) : undefined,
      longitude: formData.get('longitude') ? Number(formData.get('longitude')) : undefined,
      isClaimable: formData.get('isClaimable') === 'true',
      claimedBy: formData.get('claimedBy') || undefined,
      verificationStatus: formData.get('verificationStatus') || 'pending'
    }

    const result = hospitalSchema.safeParse(dataObject)
    if (!result.success) {
      return { error: result.error }
    }
    return { data: result.data }
  }

  const { mutate: createHospital, state: createState } = useMutation({
    key: ['hospitals', 'create'],
    mutation: async (data: { formData: FormData }) => {
      const validationResult = validateFormData(data.formData)
      if (validationResult.error) {
        throw new Error('Invalid form data')
      }
      
      const response = await fetch('/api/hospitals', {
        method: 'POST',
        body: data.formData
      })
      await refetchHospitals()
      return response
    }
  })

  const { mutate: updateHospital, state: updateState } = useMutation({
    key: ['hospitals', 'update'],
    mutation: async (data: { id: string; formData: FormData }) => {
      const validationResult = validateFormData(data.formData)
      if (validationResult.error) {
        throw new Error('Invalid form data')
      }

      const response = await fetch(`/api/hospitals/${data.id}`, {
        method: 'PATCH',
        body: data.formData
      })
      await refetchHospitals()
      return response
    }
  })

  const { mutate: deleteHospital, state: deleteState } = useMutation({
    key: ['hospitals', 'delete'],
    mutation: async (data: { id: string }) => {
      const response = await fetch(`/api/hospitals/${data.id}`, {
        method: 'DELETE'
      })
      await refetchHospitals()
      return response
    }
  })

  async function submitHospital(
    formData: FormData, 
    method: 'POST' | 'PATCH' | 'DELETE' = 'POST'
  ): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      const validationResult = method !== 'DELETE' ? validateFormData(formData) : null
      if (validationResult?.error) {
        return { 
          success: false, 
          error: validationResult.error.errors.map(e => e.message).join(', ')
        }
      }

      let response
      switch (method) {
        case 'POST':
          response = await createHospital({ formData })
          break
        case 'PATCH':
          const id = formData.get('id') as string
          if (!id) {
            return { success: false, error: 'Hospital ID is required for update' }
          }
          response = await updateHospital({ id, formData })
          break
        case 'DELETE':
          const deleteId = formData.get('id') as string
          if (!deleteId) {
            return { success: false, error: 'Hospital ID is required for deletion' }
          }
          response = await deleteHospital({ id: deleteId })
          break
        default:
          return { success: false, error: 'Invalid method' }
      }

      await refetchHospitals()
      return { success: true, data: response }
    } catch (error: any) {
      console.error('Hospital submission error:', error)
      return { 
        success: false, 
        error: error.message || 'An error occurred while submitting the hospital data' 
      }
    }
  }

  return {
    hospitals,
    hospitalsStatus,
    hospitalsError,
    isHospitalsLoading,
    isHospitalsPending,
    refreshHospitals,
    refetchHospitals,
    getHospitalById,
    createHospital,
    updateHospital,
    deleteHospital,
    submitHospital,
    createState,
    updateState,
    deleteState,
    ...queryRest
  }
})
