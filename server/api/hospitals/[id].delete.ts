import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const profileId = event.context.session.secure.profileId
  const hospitalId = event.context.params?.id
  const db = useDrizzle()

  if (!hospitalId) {
    throw createError({
      statusCode: 400,
      message: 'Hospital ID is required'
    })
  }

  // Get user profile
  const profile = await db.select()
    .from(tables.profiles)
    .where(eq(tables.profiles.email, event.context.session.user.email))
    .get()

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  // Check if the hospital exists and belongs to the user
  const hospital = await db.select()
    .from(tables.hospitals)
    .where(
      and(
        eq(tables.hospitals.id, hospitalId),
        eq(tables.hospitals.profileId, profileId)
      )
    )
    .get()

  if (!hospital) {
    throw createError({
      statusCode: 404,
      message: 'Hospital not found or you do not have permission to delete it'
    })
  }

  // Check if the hospital is claimed by another user
  if (hospital.claimedBy && hospital.claimedBy !== profileId) {
    throw createError({
      statusCode: 403,
      message: 'This hospital profile has been claimed by another user and cannot be deleted'
    })
  }

  // Delete the hospital
  await db.delete(tables.hospitals)
    .where(eq(tables.hospitals.id, hospitalId))
    .run()

  return {
    success: true,
    message: 'Hospital deleted successfully'
  }
})
