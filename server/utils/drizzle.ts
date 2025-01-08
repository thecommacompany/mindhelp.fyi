import { drizzle } from 'drizzle-orm/d1'
import { sql, eq, and, or, like, desc, asc } from 'drizzle-orm'

import * as schema from '../database/schema'

export const tables = schema

/**
 * Server composable to interact with the database
 * Auto-imported in server routes
 */
export function useDrizzle() {
  return drizzle(hubDatabase(), { schema })
}

// Export commonly used operators
export { sql, eq, and, or, like, desc, asc }

// Export types
export type Profile = typeof schema.profiles.$inferSelect
export type Professional = typeof schema.professionals.$inferSelect
export type Hospital = typeof schema.hospitals.$inferSelect
export type Organization = typeof schema.organizations.$inferSelect
export type Review = typeof schema.reviews.$inferSelect
export type SupportGroup = typeof schema.supportGroups.$inferSelect
export type ProfessionalAffiliation = typeof schema.professionalAffiliations.$inferSelect
