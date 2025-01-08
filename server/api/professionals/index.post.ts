import { eq } from 'drizzle-orm'
import { requireRole, getProfileId } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const profileId = await getProfileId(event)
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

  // Create professional entry
  const professional = await db.insert(tables.professionals)
    .values({
      id: crypto.randomUUID(),
      profileId,
      specialization: body.specialization,
      qualifications: body.qualifications,
      licenseNumber: body.licenseNumber,
      experience: body.experience,
      consultationFees: body.consultationFees,
      availableForOnline: body.availableForOnline,
      languages: body.languages,
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

  // Update profile role if not already a professional
  if (event.context.session.secure?.role === 'user') {
    await db.update(tables.profiles)
      .set({ role: 'professional' })
      .where(eq(tables.profiles.id, profileId))
      .run()
  }

  return professional
})
