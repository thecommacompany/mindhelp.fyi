import { eq, and } from 'drizzle-orm'
import { randomUUID } from 'crypto'
export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Professional ID is required.'
    })
  }

  const profileId = event.context.session.secure.profileId
  const form = await readFormData(event)
  const db = useDrizzle()

  // Get services array from form
  const services = form.get('services') ? JSON.parse(form.get('services') as string) : null

  // Parse form data
  const professionalData = {
    name: form.get('name') as string,
    phone: form.get('phone') as string,
    specialization: form.get('specialization') as string,
    qualifications: form.get('qualifications') as string,
    licenseNumber: form.get('licenseNumber') as string | null,
    experience: form.get('experience') ? Number(form.get('experience')) : null,
    consultationFees: form.get('consultationFees') ? Number(form.get('consultationFees')) : null,
    availableForOnline: form.get('availableForOnline') === 'true',
    languages: form.get('languages') as string,
    address: form.get('address') as string | null,
    city: form.get('city') as string | null,
    state: form.get('state') as string | null,
    country: form.get('country') as string | null,
    latitude: form.get('latitude') ? Number(form.get('latitude')) : null,
    longitude: form.get('longitude') ? Number(form.get('longitude')) : null,
    isClaimable: form.get('isClaimable') === 'true',
    updatedAt: new Date()
  }

  // Get the professional profile
  const professional = await db.select()
    .from(tables.professionals)
    .where(eq(tables.professionals.id, id))
    .get()

  if (!professional) {
    throw createError({
      statusCode: 404,
      message: 'Professional profile not found.'
    })
  }

  // If the profile is claimed by someone else, reject the update
  if (professional.claimedBy && professional.claimedBy !== profileId) {
    throw createError({
      statusCode: 403,
      message: 'This profile has been claimed by another professional.'
    })
  }

  // Check if user has permission to update this profile
  // User must either:
  // 1. Be the original creator (profileId matches)
  // 2. Have claimed this profile (claimedBy matches)
  if (professional.profileId !== profileId && professional.claimedBy !== profileId) {
    throw createError({
      statusCode: 403,
      message: 'You do not have permission to update this profile.'
    })
  }

  // Filter out undefined values to only update provided fields
  const updateData = Object.fromEntries(
    Object.entries(professionalData).filter(([_, value]) => value !== undefined)
  )

  // Update professional entry
  const updatedProfessional = await db.update(tables.professionals)
    .set(updateData)
    .where(eq(tables.professionals.id, id))
    .returning()
    .get()

  // Update services if provided
  if (services !== null) {
    // Delete existing services
    await db.delete(tables.entityServices)
      .where(
        and(
          eq(tables.entityServices.entityType, 'professional'),
          eq(tables.entityServices.entityId, id)
        )
      )
      .run()

    // Add new services
    if (services.length > 0) {
      const serviceEntries = services.map(serviceType => ({
        id: randomUUID(),
        entityType: 'professional',
        entityId: id,
        serviceType,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      await db.insert(tables.entityServices).values(serviceEntries)
    }
  }

  return updatedProfessional
})
