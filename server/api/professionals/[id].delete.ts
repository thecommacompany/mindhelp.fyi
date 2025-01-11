import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const profileId = event.context.session.secure.profileId
  const professionalId = event.context.params?.id
  const db = useDrizzle()

  if (!professionalId) {
    throw createError({
      statusCode: 400,
      message: 'Professional ID is required'
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

  // Check if the professional exists and belongs to the user
  const professional = await db.select()
    .from(tables.professionals)
    .where(
      and(
        eq(tables.professionals.id, professionalId),
        eq(tables.professionals.profileId, profileId)
      )
    )
    .get()

  if (!professional) {
    throw createError({
      statusCode: 404,
      message: 'Professional not found or you do not have permission to delete it'
    })
  }

  // Check if the professional is claimed by another user
  if (professional.claimedBy && professional.claimedBy !== profileId) {
    throw createError({
      statusCode: 403,
      message: 'This professional profile has been claimed by another user and cannot be deleted'
    })
  }

  // Delete the professional
  await db.delete(tables.professionals)
    .where(eq(tables.professionals.id, professionalId))
    .run()

  return {
    success: true,
    message: 'Professional deleted successfully'
  }
})
