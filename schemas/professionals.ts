import { z } from 'zod'
import type { Professional } from '../types/database'

export const professionalSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().nullable(),
  name: z.string(),
  phone: z.string(),
  specialization: z.string(),
  qualifications: z.string(),
  licenseNumber: z.string().nullable(),
  experience: z.number().nullable(),
  consultationFees: z.number().nullable(),
  availableForOnline: z.boolean(),
  languages: z.string(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  country: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  isClaimable: z.boolean(),
  claimedBy: z.string().nullable(),
  verificationStatus: z.string().default('pending')
}) satisfies z.ZodType<Partial<Professional>>

export type ProfessionalSchemaType = z.infer<typeof professionalSchema>
