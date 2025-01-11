import { eq, or, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDrizzle()
  const session = event.context.session

  if (!session?.secure?.profileId) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: No valid session found'
    })
  }

  const profileId = session.secure.profileId

  // For regular users, only show:
  // 1. Professionals added by them (profileId matches)
  // 2. Professionals claimed by them (claimedBy matches)
  
  return await db.select()
    .from(tables.professionals)
    .where(
      and(
        or(
          eq(tables.professionals.profileId, profileId),
          eq(tables.professionals.claimedBy, profileId)
        ),
        query.city ? eq(tables.professionals.city, query.city as string) : undefined,
        query.state ? eq(tables.professionals.state, query.state as string) : undefined,
        query.specialization ? eq(tables.professionals.specialization, query.specialization as string) : undefined,
      )
    )
    .all()
})
