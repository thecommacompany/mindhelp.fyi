import { z } from 'zod'
import type { Hospital } from '~/types/database'

export const hospitalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone is required'),
  type: z.string().min(1, 'Type is required'),
  facilities: z.string().optional(),
  emergencyServices: z.boolean().default(false),
  accreditation: z.string().optional(),
  website: z.string().optional().nullable(),
  openingHours: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  latitude: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  longitude: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
  isClaimable: z.boolean().default(true),
  claimedBy: z.string().nullable(),
  verificationStatus: z.enum(['pending', 'verified', 'rejected']).default('pending'),
  profileId: z.string().optional()
}) satisfies z.ZodType<Partial<Hospital>>

export type HospitalSchemaType = z.infer<typeof hospitalSchema>
