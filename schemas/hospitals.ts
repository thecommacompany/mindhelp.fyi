import { z } from 'zod'
import type { Hospital } from '../types/database'

export const hospitalSchema = z.object({
  name: z.string(),
  type: z.string(),
  facilities: z.string().optional(),
  emergencyServices: z.boolean().default(false),
  accreditation: z.string().optional(),
  website: z.string().url().optional(),
  openingHours: z.string().optional(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isClaimable: z.boolean().default(true),
  claimedBy: z.string().optional(),
  verificationStatus: z.string().default('pending')
}) satisfies z.ZodType<Partial<Hospital>>

export type HospitalSchemaType = z.infer<typeof hospitalSchema>
