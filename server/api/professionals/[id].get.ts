import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Professional ID is required'
    })
  }

  // Get the professional
  const professional = await db.select()
    .from(tables.professionals)
    .where(eq(tables.professionals.id, id))
    .get()

  if (!professional) {
    throw createError({
      statusCode: 404,
      message: 'Professional not found'
    })
  }

  // Get service types for this professional
  const services = await db.select({
    serviceType: tables.entityServices.serviceType
  })
    .from(tables.entityServices)
    .where(
      and(
        eq(tables.entityServices.entityType, 'professional'),
        eq(tables.entityServices.entityId, id),
        eq(tables.entityServices.isActive, true)
      )
    )
    .all()

  // Return professional with their service types
  return {
    ...professional,
    services: services.map(s => s.serviceType)
  }
})
