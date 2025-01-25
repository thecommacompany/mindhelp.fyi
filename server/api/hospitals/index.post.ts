import { eq, and, or } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const profileId = event.context.session.secure.profileId
  const form = await readFormData(event)
  const db = useDrizzle()

  // Get services array from form
  const services = form.get('services') ? JSON.parse(form.get('services') as string) : []

  // Parse form data
  const hospitalData = {
    id: randomUUID(),
    profileId,
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
    verificationStatus: 'pending' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }

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

  // Check if a hospital with the same name and address exists
  const existingHospital = await db.select()
    .from(tables.hospitals)
    .where(
      and(
        eq(tables.hospitals.name, hospitalData.name),
        eq(tables.hospitals.address, hospitalData.address)
      )
    )
    .get()

  if (existingHospital) {
    throw createError({
      statusCode: 409,
      message: 'A hospital with this name and address already exists.'
    })
  }

  // Get user's existing profiles
  const existingProfiles = await db.select()
    .from(tables.hospitals)
    .where(
      or(
        eq(tables.hospitals.profileId, profileId),
        eq(tables.hospitals.claimedBy, profileId)
      )
    )
    .all()

  // If creating a non-claimable profile
  if (!hospitalData.isClaimable) {
    // Check if user already has a non-claimable profile or has claimed one
    const hasNonClaimableOrClaimed = existingProfiles.some(h => 
      (!h.isClaimable && h.profileId === profileId) || // has non-claimable profile
      h.claimedBy === profileId // has claimed a profile
    )

    if (hasNonClaimableOrClaimed) {
      throw createError({
        statusCode: 409,
        message: 'You already have a non-claimable profile or have claimed one. You cannot create another non-claimable profile.'
      })
    }
  } else {
    // If creating a claimable profile
    // Check if user has already claimed another profile
    const hasClaimed = existingProfiles.some(h => h.claimedBy === profileId)
    if (hasClaimed) {
      throw createError({
        statusCode: 409,
        message: 'You have already claimed another hospital profile. You cannot create a claimable profile.'
      })
    }
  }

  // Start a transaction
  return await db.transaction(async (tx) => {
    // Create hospital
    const hospital = await tx.insert(tables.hospitals).values(hospitalData).returning().get()

    // Create service entries
    if (services.length > 0) {
      const serviceEntries = services.map(serviceType => ({
        id: randomUUID(),
        entityType: 'hospital',
        entityId: hospital.id,
        serviceType,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      await tx.insert(tables.entityServices).values(serviceEntries)
    }

    // Update profile role if not already a hospital
    if (profile.role !== 'hospital') {
      await tx.update(tables.profiles)
        .set({ role: 'hospital' })
        .where(eq(tables.profiles.id, profile.id))
        .run()
    }

    return hospital
  })
})
