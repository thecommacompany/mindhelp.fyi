import { z } from 'zod'
import type { SupportGroup } from '../types/database'

export const supportGroupSchema = z.object({
  name: z.string(),
  organizationId: z.string().optional(),
  description: z.string(),
  meetingSchedule: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  onlineLink: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().optional(),
  focusArea: z.string(),
  isActive: z.boolean().default(true)
}) satisfies z.ZodType<Partial<SupportGroup>>

export type SupportGroupSchemaType = z.infer<typeof supportGroupSchema>
