import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  const { id } = getRouterParams(event)

  // Get user profile
  const profile = await db.select()
    .from(tables.profiles)
    .where(eq(tables.profiles.email, event.context.session.user.email))
    .get()

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found. Please create a profile first.'
    })
  }

  // Check if professional entry exists and is claimable
  const professional = await db.select()
    .from(tables.professionals)
    .where(
      and(
        eq(tables.professionals.id, id),
        eq(tables.professionals.verificationStatus, 'pending'),
        eq(tables.professionals.profileId, null)
      )
    )
    .get()

  if (!professional) {
    throw createError({
      statusCode: 404,
      message: 'Professional entry not found or not claimable'
    })
  }

  // Update professional entry with user's profile
  const updatedProfessional = await db.update(tables.professionals)
    .set({
      profileId: profile.id,
      updatedAt: new Date()
    })
    .where(eq(tables.professionals.id, id))
    .returning()
    .get()

  return updatedProfessional
})