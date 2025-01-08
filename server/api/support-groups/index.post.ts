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

  // If organizationId is provided, verify the organization exists and is verified
  if (body.organizationId) {
    const organization = await db.select()
      .from(tables.organizations)
      .where(
        and(
          eq(tables.organizations.id, body.organizationId),
          eq(tables.organizations.verificationStatus, 'verified')
        )
      )
      .get()

    if (!organization) {
      throw createError({
        statusCode: 404,
        message: 'Organization not found or not verified'
      })
    }
  }

  // Create support group entry
  const supportGroup = await db.insert(tables.supportGroups)
    .values({
      id: crypto.randomUUID(),
      name: body.name,
      organizationId: body.organizationId,
      description: body.description,
      meetingSchedule: body.meetingSchedule,
      address: body.address,
      city: body.city,
      state: body.state,
      country: body.country,
      latitude: body.latitude,
      longitude: body.longitude,
      onlineLink: body.onlineLink,
      contactPerson: body.contactPerson,
      contactEmail: body.contactEmail,
      focusArea: body.focusArea,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()
    .get()

  return supportGroup
})