export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDrizzle()

  // Build query based on parameters
  let supportGroups = await db.select({
    ...tables.supportGroups,
    organization: {
      name: tables.organizations.name,
      type: tables.organizations.type
    }
  })
    .from(tables.supportGroups)
    .leftJoin(
      tables.organizations,
      eq(tables.supportGroups.organizationId, tables.organizations.id)
    )
    .where(
      query.city ? eq(tables.supportGroups.city, query.city as string) : undefined,
      query.state ? eq(tables.supportGroups.state, query.state as string) : undefined,
      query.focusArea ? eq(tables.supportGroups.focusArea, query.focusArea as string) : undefined,
      eq(tables.supportGroups.isActive, true)
    )
    .all()

  return supportGroups
})
