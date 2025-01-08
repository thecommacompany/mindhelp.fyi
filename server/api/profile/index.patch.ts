import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  console.log('PATCH /api/profile - Start')
  const form = await readFormData(event)
  const db = useDrizzle()

  // Parse form data
  const profileData = {
    name: form.get('name') as string,
    role: form.get('role') as string,
    phone: form.get('phone') as string,
    address: form.get('address') as string,
    city: form.get('city') as string,
    state: form.get('state') as string,
    country: form.get('country') as string,
    bio: form.get('bio') as string,
  }
  console.log('Profile data:', profileData)

  // Handle profile picture upload
  const picture = form.get('picture') as File
  let photoUrl: string | undefined
  console.log('Picture received:', {
    size: picture?.size,
    type: picture?.type,
    name: picture?.name
  })

  if (picture?.size) {
    try {
      console.log('Uploading picture...')
      // Validate file
      ensureBlob(picture, {
        maxSize: '2MB',
        types: ['image']
      })

      // Generate unique filename
      const timestamp = Date.now()
      const filename = `profile-pictures/${event.context.session.user.email}-${timestamp}`
      console.log('Generated filename:', filename)

      // Upload to R2
      const blob = await hubBlob().put(filename, picture, {
        addRandomSuffix: true,
        contentType: picture.type,
        metadata: {
          userId: event.context.session.user.email,
          uploadTime: new Date().toISOString()
        }
      })
      
      console.log('Blob response:', blob)
      
      // Construct the URL to our serve endpoint
      if (!blob?.pathname) {
        throw new Error('Failed to get pathname from uploaded blob')
      }

      photoUrl = `/images/${blob.pathname}`
      console.log('Constructed photo URL:', photoUrl)
    } catch (error: any) {
      console.error('Picture upload failed:', error)
      throw createError({
        statusCode: 400,
        message: `Failed to upload profile picture: ${error.message}`
      })
    }
  }

  console.log('Updating profile in database with photoUrl:', photoUrl)
  // Update profile with all data
  const profile = await db.update(tables.profiles)
    .set({
      ...profileData,
      ...(photoUrl && { photoUrl }),
      updatedAt: new Date()
    })
    .where(eq(tables.profiles.email, event.context.session.user.email))
    .returning()
    .get()

  if (!profile) {
    console.error('Profile not found for email:', event.context.session.user.email)
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  console.log('Profile updated successfully')
  return profile
})
