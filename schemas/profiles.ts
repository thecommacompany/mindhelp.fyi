import { z } from 'zod'
import type { Profile, UserRoleType } from '../types/database'

export const userRoleEnum = z.enum(['user', 'professional', 'hospital', 'organization', 'admin'] as const) satisfies z.ZodType<UserRoleType>

export const profileSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: userRoleEnum.default('user'),
  photoUrl: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  isVerified: z.boolean().default(false)
}).partial() satisfies z.ZodType<Partial<Profile>>

export type ProfileSchemaType = z.infer<typeof profileSchema>
