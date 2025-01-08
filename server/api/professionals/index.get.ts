export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDrizzle()

  // Build query based on parameters
  let professionals = await db.select()
    .from(tables.professionals)
    .where(
      query.city ? eq(tables.professionals.city, query.city as string) : undefined,
      query.state ? eq(tables.professionals.state, query.state as string) : undefined,
      query.specialization ? eq(tables.professionals.specialization, query.specialization as string) : undefined,
      // Only show verified professionals in public listing
      eq(tables.professionals.verificationStatus, 'verified')
    )
    .all()

  return professionals
})
