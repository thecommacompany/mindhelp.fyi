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
      message: 'Only admins can verify organizations'
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

  const organization = await db.update(tables.organizations)
    .set({
      verificationStatus: status,
      updatedAt: new Date()
    })
    .where(eq(tables.organizations.id, id))
    .returning()
    .get()

  if (!organization) {
    throw createError({
      statusCode: 404,
      message: 'Organization not found'
    })
  }

  return organization
})
