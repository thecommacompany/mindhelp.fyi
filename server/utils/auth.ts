import { H3Event } from 'h3'


export async function requireRole(event: H3Event, roles: string | string[]) {
  const session = await requireUserSession(event)
  const userRole = session.secure?.role

  if (!userRole) {
    throw createError({
      statusCode: 403,
      message: 'No role assigned'
    })
  }

  const allowedRoles = Array.isArray(roles) ? roles : [roles]
  if (!allowedRoles.includes(userRole)) {
    throw createError({
      statusCode: 403,
      message: `This action requires one of these roles: ${allowedRoles.join(', ')}`
    })
  }

  return session
}

export async function getProfileId(event: H3Event) {
  const session = await requireUserSession(event)
  const profileId = session.secure?.profileId

  if (!profileId) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found'
    })
  }

  return profileId
}
