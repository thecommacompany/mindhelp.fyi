import { z } from 'zod'
import type { Organization } from '../types/database'

export const organizationSchema = z.object({
  name: z.string(),
  type: z.string(),
  registrationNumber: z.string().optional(),
  website: z.string().optional(),
  focusAreas: z.string().optional(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isClaimable: z.boolean().default(true),
  claimedBy: z.string().optional(),
  verificationStatus: z.string().default('pending')
}) satisfies z.ZodType<Partial<Organization>>

export type OrganizationSchemaType = z.infer<typeof organizationSchema>
