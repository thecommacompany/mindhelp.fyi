import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {

  
  const db = useDrizzle()
  
  // Ensure we have a session with user email
  const userEmail = event.context?.session?.user?.email
  if (!userEmail) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - No valid session'
    })
  }

  // Get profile using the email
  const profile = await db.select()
    .from(tables.profiles)
    .where(eq(tables.profiles.email, userEmail))
    .get()

  if (!profile) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  return profile
})
