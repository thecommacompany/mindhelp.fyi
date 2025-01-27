import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Hospital ID is required'
    })
  }

  // Get the hospital
  const hospital = await db.select()
    .from(tables.hospitals)
    .where(eq(tables.hospitals.id, id))
    .get()

  if (!hospital) {
    throw createError({
      statusCode: 404,
      message: 'Hospital not found'
    })
  }

  // Get service types for this hospital
  const services = await db.select({
    serviceType: tables.entityServices.serviceType
  })
    .from(tables.entityServices)
    .where(
      and(
        eq(tables.entityServices.entityType, 'hospital'),
        eq(tables.entityServices.entityId, id),
        eq(tables.entityServices.isActive, true)
      )
    )
    .all()

  // Return hospital with their service types
  return {
    ...hospital,
    services: services.map(s => s.serviceType)
  }
})
