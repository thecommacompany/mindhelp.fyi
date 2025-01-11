import { eq, and, or } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const profileId = event.context.session.secure.profileId
  const form = await readFormData(event)
  const db = useDrizzle()

  // Parse form data
  const professionalData = {
    id: randomUUID(),
    profileId,
    phone: form.get('phone') as string,
    name: form.get('name') as string,
    specialization: form.get('specialization') as string,
    qualifications: form.get('qualifications') as string,
    licenseNumber: form.get('licenseNumber') as string || null,
    experience: form.get('experience') ? Number(form.get('experience')) : null,
    consultationFees: form.get('consultationFees') ? Number(form.get('consultationFees')) : null,
    availableForOnline: form.get('availableForOnline') === 'true',
    languages: form.get('languages') as string,
    address: form.get('address') as string || null,
    city: form.get('city') as string || null,
    state: form.get('state') as string || null,
    country: form.get('country') as string || null,
    latitude: form.get('latitude') ? Number(form.get('latitude')) : null,
    longitude: form.get('longitude') ? Number(form.get('longitude')) : null,
    isClaimable: form.get('isClaimable') === 'true',
    verificationStatus: 'pending' as const
  }

  console.log('Professional Data:', professionalData)

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

  // Check if a professional with the same license number exists
  const existingProfessional = await db.select()
    .from(tables.professionals)
    .where(eq(tables.professionals.licenseNumber, professionalData.licenseNumber))
    .get()

  if (existingProfessional) {
    throw createError({
      statusCode: 409,
      message: 'A professional with this license number already exists.'
    })
  }

  // Get user's existing profiles
  const existingProfiles = await db.select()
    .from(tables.professionals)
    .where(
      or(
        eq(tables.professionals.profileId, profileId),
        eq(tables.professionals.claimedBy, profileId)
      )
    )
    .all()

  // If creating a non-claimable profile
  if (!professionalData.isClaimable) {
    // Check if user already has a non-claimable profile or has claimed one
    const hasNonClaimableOrClaimed = existingProfiles.some(p => 
      (!p.isClaimable && p.profileId === profileId) || // has non-claimable profile
      p.claimedBy === profileId // has claimed a profile
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
    const hasClaimed = existingProfiles.some(p => p.claimedBy === profileId)
    if (hasClaimed) {
      throw createError({
        statusCode: 409,
        message: 'You have already claimed another professional profile. You cannot create a claimable profile.'
      })
    }
  }

  // Create professional entry
  const professional = await db.insert(tables.professionals)
    .values(professionalData)
    .returning()
    .get()

  return professional
})
