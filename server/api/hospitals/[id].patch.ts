import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Hospital ID is required.'
    })
  }

  const profileId = event.context.session.secure.profileId
  const form = await readFormData(event)
  const db = useDrizzle()

  // Get services array from form
  const services = form.get('services') ? JSON.parse(form.get('services') as string) : null

  // Parse form data
  const hospitalData = {
    name: form.get('name') as string,
    phone: form.get('phone') as string,
    type: form.get('type') as string,
    facilities: form.get('facilities') as string || null,
    emergencyServices: form.get('emergencyServices') === 'true',
    accreditation: form.get('accreditation') as string || null,
    website: form.get('website') as string || null,
    openingHours: form.get('openingHours') as string || null,
    address: form.get('address') as string,
    city: form.get('city') as string,
    state: form.get('state') as string,
    country: form.get('country') as string,
    latitude: form.get('latitude') ? Number(form.get('latitude')) : null,
    longitude: form.get('longitude') ? Number(form.get('longitude')) : null,
    isClaimable: form.get('isClaimable') === 'true',
    updatedAt: new Date()
  }

  // Get the hospital profile
  const hospital = await db.select()
    .from(tables.hospitals)
    .where(eq(tables.hospitals.id, id))
    .get()

  if (!hospital) {
    throw createError({
      statusCode: 404,
      message: 'Hospital profile not found.'
    })
  }

  // If the profile is claimed by someone else, reject the update
  if (hospital.claimedBy && hospital.claimedBy !== profileId) {
    throw createError({
      statusCode: 403,
      message: 'This profile has been claimed by another hospital.'
    })
  }

  // Check if user has permission to update this profile
  // User must either:
  // 1. Be the original creator (profileId matches)
  // 2. Have claimed this profile (claimedBy matches)
  if (hospital.profileId !== profileId && hospital.claimedBy !== profileId) {
    throw createError({
      statusCode: 403,
      message: 'You do not have permission to update this profile.'
    })
  }

  // Filter out undefined values to only update provided fields
  const updateData = Object.fromEntries(
    Object.entries(hospitalData).filter(([_, value]) => value !== undefined)
  )

  // Start transaction
  return await db.transaction(async (tx) => {
    // Update hospital entry
    const updatedHospital = await tx.update(tables.hospitals)
      .set(updateData)
      .where(eq(tables.hospitals.id, id))
      .returning()
      .get()

    // Update services if provided
    if (services !== null) {
      // Delete existing services
      await tx.delete(tables.entityServices)
        .where(
          and(
            eq(tables.entityServices.entityType, 'hospital'),
            eq(tables.entityServices.entityId, id)
          )
        )
        .run()

      // Add new services
      if (services.length > 0) {
        const serviceEntries = services.map(serviceType => ({
          id: randomUUID(),
          entityType: 'hospital',
          entityId: id,
          serviceType,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }))

        await tx.insert(tables.entityServices).values(serviceEntries)
      }
    }

    return updatedHospital
  })
})
