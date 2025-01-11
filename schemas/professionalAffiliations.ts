import { z } from 'zod'
import type { ProfessionalAffiliation } from '../types/database'

export const professionalAffiliationSchema = z.object({
  professionalId: z.string(),
  hospitalId: z.string(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  isActive: z.boolean().default(true)
}) satisfies z.ZodType<Partial<ProfessionalAffiliation>>

export type ProfessionalAffiliationSchemaType = z.infer<typeof professionalAffiliationSchema>
