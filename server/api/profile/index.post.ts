import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const form = await readFormData(event)
  const db = useDrizzle()
console.log("update profile")
  // Parse form data
  const profileData = {
    name: form.get('name') as string,
    role: form.get('role') as string || 'user',
    phone: form.get('phone') as string,
    address: form.get('address') as string,
    city: form.get('city') as string,
    state: form.get('state') as string,
    country: form.get('country') as string,
    bio: form.get('bio') as string,
  }

  // Check if profile already exists
  const existingProfile = await db.select()
    .from(tables.profiles)
    .where(eq(tables.profiles.email, event.context.session.user.email))
    .get()

  if (existingProfile) {
    throw createError({
      statusCode: 400,
      message: 'Profile already exists'
    })
  }

  // Handle profile picture upload
  const picture = form.get('picture') as File
  let photoUrl: string | undefined
console.log(picture)
  if (picture?.size) {
    try {
      // Validate file
      ensureBlob(picture, {
        maxSize: '2MB',
        types: ['image']
      })

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `profile-pictures/${event.context.session.user.email}-${timestamp}`

      // Upload to R2
      const blob = await hubBlob().put(filename, picture, {
        addRandomSuffix: true,
        contentType: picture.type,
        metadata: {
          userId: event.context.session.user.email,
          uploadTime: new Date().toISOString()
        }
      })

      if (!blob?.pathname) {
        throw new Error('Failed to get pathname from uploaded blob')
      }

      photoUrl = `/images/${blob.pathname}`
    } catch (error: any) {
      throw createError({
        statusCode: 400,
        message: `Failed to upload profile picture: ${error.message}`
      })
    }
  }

  // Create new profile
  const profile = await db.insert(tables.profiles)
    .values({
      id: crypto.randomUUID(),
      email: event.context.session.user.email,
      photoUrl,
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    .returning()
    .get()

  return profile
})