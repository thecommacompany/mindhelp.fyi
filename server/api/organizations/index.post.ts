import { eq } from 'drizzle-orm'

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

  // Create organization entry
  const organization = await db.insert(tables.organizations)
    .values({
      id: crypto.randomUUID(),
      profileId: profile.id,
      name: body.name,
      type: body.type,
      description: body.description,
      services: body.services,
      website: body.website,
      openingHours: body.openingHours,
      phone: body.phone,
      email: body.email,
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country,
      verificationStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()
    .get()

  return organization
})