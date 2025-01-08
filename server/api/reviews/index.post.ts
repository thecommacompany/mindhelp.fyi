import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = useDrizzle()

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

  // Validate entity exists based on type
  let entityExists = false
  switch (body.entityType) {
    case 'professional':
      entityExists = await db.select()
        .from(tables.professionals)
        .where(
          and(
            eq(tables.professionals.id, body.entityId),
            eq(tables.professionals.verificationStatus, 'verified')
          )
        )
        .get()
      break
    case 'hospital':
      entityExists = await db.select()
        .from(tables.hospitals)
        .where(
          and(
            eq(tables.hospitals.id, body.entityId),
            eq(tables.hospitals.verificationStatus, 'verified')
          )
        )
        .get()
      break
    case 'organization':
      entityExists = await db.select()
        .from(tables.organizations)
        .where(
          and(
            eq(tables.organizations.id, body.entityId),
            eq(tables.organizations.verificationStatus, 'verified')
          )
        )
        .get()
      break
    default:
      throw createError({
        statusCode: 400,
        message: 'Invalid entity type'
      })
  }

  if (!entityExists) {
    throw createError({
      statusCode: 404,
      message: 'Entity not found or not verified'
    })
  }

  // Create review
  const review = await db.insert(tables.reviews)
    .values({
      id: crypto.randomUUID(),
      userId: profile.id,
      entityType: body.entityType,
      entityId: body.entityId,
      rating: body.rating,
      review: body.review,
      visitDate: body.visitDate ? new Date(body.visitDate) : undefined,
      isAnonymous: body.isAnonymous || false,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()
    .get()

  return review
})