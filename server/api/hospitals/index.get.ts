export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDrizzle()

  // Build query based on parameters
  let hospitals = await db.select()
    .from(tables.hospitals)
    .where(
      query.city ? eq(tables.hospitals.city, query.city as string) : undefined,
      query.state ? eq(tables.hospitals.state, query.state as string) : undefined,
      query.type ? eq(tables.hospitals.type, query.type as string) : undefined,
      query.emergencyServices ? eq(tables.hospitals.emergencyServices, true) : undefined,
      // Only show verified hospitals in public listing
      eq(tables.hospitals.verificationStatus, 'verified')
    )
    .all()

  return hospitals
})
