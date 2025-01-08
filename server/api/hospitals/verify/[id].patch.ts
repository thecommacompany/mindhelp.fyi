import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  
  // Check if user is admin
  const profile = await db.select()
    .from(tables.profiles)
    .where(eq(tables.profiles.email, event.context.session.user.email))
    .get()

  if (!profile || profile.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Only admins can verify hospitals'
    })
  }

  const { id } = getRouterParams(event)
  const { status } = await readBody(event)

  if (!['verified', 'rejected', 'pending'].includes(status)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid status'
    })
  }

  const hospital = await db.update(tables.hospitals)
    .set({
      verificationStatus: status,
      updatedAt: new Date()
    })
    .where(eq(tables.hospitals.id, id))
    .returning()
    .get()

  if (!hospital) {
    throw createError({
      statusCode: 404,
      message: 'Hospital not found'
    })
  }

  return hospital
})