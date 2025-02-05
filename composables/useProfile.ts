import { defineQuery, useQuery, useMutation } from '@pinia/colada'
import { profileSchema } from '@/schemas'
import { z } from 'zod'

export type ProfileFormData = z.infer<typeof profileSchema>

export const profileFormSchema = profileSchema.pick({
  name: true,
  role: true,
  phone: true,
  photoUrl: true,
  city: true,
  state: true,
  country: true,
  address: true
})

export const useProfile = defineQuery(() => {
  const fetch = useRequestFetch()

  const { 
    state: profile, 
    asyncStatus: profileStatus,
    error: profileError,
    isLoading: isProfileLoading,
    isPending: isProfilePending,
    refresh: refreshProfile,
    refetch: refetchProfile,
    ...queryRest 
  } = useQuery({
    key: ['profile'],
    query: async () => {
      const response = await fetch('/api/profile')
      return response
    }
  })

  const validateFormData = (formData: FormData): { data?: any; error?: z.ZodError } => {
    type DataObject = {
      [key: string]: FormDataEntryValue | null | undefined;
      name: FormDataEntryValue | null;
      role: FormDataEntryValue | null;
      phone?: FormDataEntryValue | null;
      photoUrl?: FormDataEntryValue | null;
      city?: FormDataEntryValue | null;
      state?: FormDataEntryValue | null;
      address?: FormDataEntryValue | null;
      country?: FormDataEntryValue | null;
    }

    const dataObject: DataObject = {
      name: formData.get('name'),
      role: formData.get('role'),
      phone: formData.get('phone') || undefined,
      photoUrl: formData.get('photoUrl') || undefined,
      city: formData.get('city') || undefined,
      state: formData.get('state') || undefined,
      address: formData.get('address') || undefined,
      country: formData.get('country') || undefined
    }

    // Remove undefined values
    Object.keys(dataObject).forEach(key => {
      if (dataObject[key as keyof DataObject] === undefined) {
        delete dataObject[key as keyof DataObject]
      }
    })

    const result = profileFormSchema.safeParse(dataObject)
    if (!result.success) {

      return { error: result.error }
    }
    return { data: result.data }
  }

  const { mutate: createProfile, state: createState } = useMutation({
    key: ['profile', 'create'],
    mutation: async (data: { formData: FormData }) => {
      const validationResult = validateFormData(data.formData)
      if (validationResult.error) {
        throw new Error('Invalid form data')
      }
      
      const response = await fetch('/api/profile', {
        method: 'POST',
        body: data.formData
      })
      return response
    }
  })

  const { mutate: updateProfile, state: updateState } = useMutation({
    key: ['profile', 'update'],
    mutation: async (data: { formData: FormData }) => {
      const validationResult = validateFormData(data.formData)
      if (validationResult.error) {
        throw new Error('Invalid form data')
      }

      const response = await fetch('/api/profile', {
        method: 'PATCH',
        body: data.formData
      })
      return response
    }
  })

  const submitProfile = async (formData: FormData): Promise<{ success: boolean; error?: string }> => {
    try {
      const validationResult = validateFormData(formData)
      if (validationResult.error) {
        return { 
          success: false, 
          error: validationResult.error.errors.map(e => e.message).join(', ')
        }
      }

      if (profile.value?.data) {
        await updateProfile({ formData })
        return { success: true }
      } else {
        await createProfile({ formData })
        return { success: true }
      }
    } catch (error: any) {
      return { 
        success: false, 
        error: error.data?.message || error.message || 'Failed to submit profile'
      }
    }
  }

  return {
    profile,
    profileStatus,
    profileError,
    isProfileLoading,
    isProfilePending,
    refreshProfile,
    refetchProfile,
    ...queryRest,
    createState,
    updateState,
    submitProfile,
    validateFormData
  }
})
