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
      message: 'Only admins can verify professionals'
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

  const professional = await db.update(tables.professionals)
    .set({
      verificationStatus: status,
      updatedAt: new Date()
    })
    .where(eq(tables.professionals.id, id))
    .returning()
    .get()

  if (!professional) {
    throw createError({
      statusCode: 404,
      message: 'Professional not found'
    })
  }

  return professional
})