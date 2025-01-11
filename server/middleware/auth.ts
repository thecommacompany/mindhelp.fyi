import { eq } from 'drizzle-orm'

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/api/_auth',  // This will match all auth routes including Google OAuth
  
  { path: '/api/hospitals', method: 'GET' },
  { path: '/api/organizations', method: 'GET' },
  { path: '/api/support-groups', method: 'GET' }
]

export default defineEventHandler(async (event) => {
  // Skip auth check during prerendering
  if (process.env.prerender) {
    return
  }

  try {
    // Only apply to API routes
    if (!event.path.startsWith('/api/')) {
      return
    }



    // Check if route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => {
      if (typeof route === 'string') {
        return event.path.startsWith(route)
      }
      return event.path === route.path && event.method === route.method
    })

    if (isPublicRoute) {
      return
    }

    const session = await getUserSession(event)
 
    
    if (!session?.user?.email) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - No valid session'
      })
    }

    // Skip profile check for profile creation endpoint
    if (event.path === '/api/profile' && event.method === 'POST') {
      event.context = event.context || {}
      event.context.session = session
      return
    }

    // Get user profile
    const db = useDrizzle()
    const profile = await db.select()
      .from(tables.profiles)
      .where(eq(tables.profiles.email, session.user.email))
      .get()

    if (!profile) {
      throw createError({
        statusCode: 404,
        message: 'Profile not found'
      })
    }

    // Ensure context exists
    event.context = event.context || {}
    
    // Set session in context
    event.context.session = {
      user: session.user,  // Keep the original user object
      secure: {
        role: profile.role,
        profileId: profile.id
      }
    }


  } catch (error) {
    console.error('Auth middleware error:', error)
    throw error
  }
})
