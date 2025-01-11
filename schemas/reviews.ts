import { z } from 'zod'
import type { Review } from '../types/database'

export const reviewSchema = z.object({
  userId: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  rating: z.number(),
  review: z.string().optional(),
  visitDate: z.date().optional(),
  isAnonymous: z.boolean().default(false)
}) satisfies z.ZodType<Partial<Review>>

export type ReviewSchemaType = z.infer<typeof reviewSchema>
