export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDrizzle()

  // Build query based on parameters
  let organizations = await db.select()
    .from(tables.organizations)
    .where(
      query.city ? eq(tables.organizations.city, query.city as string) : undefined,
      query.state ? eq(tables.organizations.state, query.state as string) : undefined,
      query.type ? eq(tables.organizations.type, query.type as string) : undefined,
      // Only show verified organizations in public listing
      eq(tables.organizations.verificationStatus, 'verified')
    )
    .all()

  return organizations
})
