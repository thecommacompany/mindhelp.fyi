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

  // Create hospital entry
  const hospital = await db.insert(tables.hospitals)
    .values({
      id: crypto.randomUUID(),
      profileId: profile.id,
      name: body.name,
      type: body.type,
      facilities: body.facilities,
      emergencyServices: body.emergencyServices,
      accreditation: body.accreditation,
      website: body.website,
      openingHours: body.openingHours,
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country,
      latitude: body.latitude,
      longitude: body.longitude,
      isClaimable: false,
      verificationStatus: 'pending'
    })
    .returning()
    .get()

  // Update profile role if not already a hospital
  if (profile.role === 'user') {
    await db.update(tables.profiles)
      .set({ role: 'hospital' })
      .where(eq(tables.profiles.id, profile.id))
      .run()
  }

  return hospital
})
