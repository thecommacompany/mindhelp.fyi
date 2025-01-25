import { eq, or, and, sql } from 'drizzle-orm'
import { professionals, hospitals, organizations, entityServices } from '~/server/database/schema'

// Function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const db = useDrizzle()
  
  const { serviceType, latitude, longitude, entityType } = query
  const maxDistance = query.maxDistance ? parseFloat(query.maxDistance as string) : 50

  const lat = parseFloat(latitude as string)
  const lon = parseFloat(longitude as string)
  
  let allResults = []

  // Get professionals if no entityType specified or if entityType is 'professional'
  if (!entityType || entityType === 'professional') {
    const professionalResults = await db.select({
      id: professionals.id,
      name: professionals.name,
      type: sql<string>`'professional'`,
      specialization: professionals.specialization,
      city: professionals.city,
      state: professionals.state,
      address: professionals.address,
      latitude: professionals.latitude,
      longitude: professionals.longitude,
      isOnline: professionals.availableForOnline,
      verificationStatus: professionals.verificationStatus,
      phone: professionals.phone,
      isClaimable: professionals.isClaimable,
      claimedBy: professionals.claimedBy,
      services: sql<string[]>`json_group_array(DISTINCT ${entityServices.serviceType})`
    })
    .from(professionals)
    .leftJoin(entityServices, and(
      eq(entityServices.entityId, professionals.id),
      eq(entityServices.entityType, 'professional')
    ))
    .where(
      serviceType ? 
        sql`EXISTS (
          SELECT 1 FROM ${entityServices} es 
          WHERE es.entity_id = ${professionals.id} 
          AND es.entity_type = 'professional'
          AND es.service_type = ${serviceType}
          AND es.is_active = 1
        )` : undefined
    )
    .groupBy(professionals.id)
    .all()
    
    // Filter out null values from services array and parse JSON
    allResults.push(...professionalResults.map(result => ({
      ...result,
      services: JSON.parse(result.services as string).filter(Boolean)
    })))
  }

  // Get hospitals if no entityType specified or if entityType is 'hospital'
  if (!entityType || entityType === 'hospital') {
    const hospitalResults = await db.select({
      id: hospitals.id,
      name: hospitals.name,
      type: sql<string>`'hospital'`,
      specialization: hospitals.type,
      city: hospitals.city,
      state: hospitals.state,
      latitude: hospitals.latitude,
      address: hospitals.address,
      longitude: hospitals.longitude,
      isOnline: sql<boolean>`false`,
      verificationStatus: hospitals.verificationStatus,
      phone: hospitals.phone,
      isClaimable: hospitals.isClaimable,
      claimedBy: hospitals.claimedBy,
      services: sql<string[]>`json_group_array(DISTINCT ${entityServices.serviceType})`
    })
    .from(hospitals)
    .leftJoin(entityServices, and(
      eq(entityServices.entityId, hospitals.id),
      eq(entityServices.entityType, 'hospital')
    ))
    .where(
      serviceType ? 
        sql`EXISTS (
          SELECT 1 FROM ${entityServices} es 
          WHERE es.entity_id = ${hospitals.id} 
          AND es.entity_type = 'hospital'
          AND es.service_type = ${serviceType}
          AND es.is_active = 1
        )` : undefined
    )
    .groupBy(hospitals.id)
    .all()
    
    // Filter out null values from services array and parse JSON
    allResults.push(...hospitalResults.map(result => ({
      ...result,
      services: JSON.parse(result.services as string).filter(Boolean)
    })))
  }

  // Get organizations if no entityType specified or if entityType is 'organization'
  if (!entityType || entityType === 'organization') {
    const organizationResults = await db.select({
      id: organizations.id,
      name: organizations.name,
      type: sql<string>`'organization'`,
      specialization: organizations.type,
      city: organizations.city,
      state: organizations.state,
      address: organizations.address,
      latitude: organizations.latitude,
      longitude: organizations.longitude,
      isOnline: sql<boolean>`false`,
      verificationStatus: organizations.verificationStatus,
      phone: organizations.phone,
      isClaimable: organizations.isClaimable,
      claimedBy: organizations.claimedBy,
      services: sql<string[]>`json_group_array(DISTINCT ${entityServices.serviceType})`
    })
    .from(organizations)
    .leftJoin(entityServices, and(
      eq(entityServices.entityId, organizations.id),
      eq(entityServices.entityType, 'organization')
    ))
    .where(
      serviceType ? 
        sql`EXISTS (
          SELECT 1 FROM ${entityServices} es 
          WHERE es.entity_id = ${organizations.id} 
          AND es.entity_type = 'organization'
          AND es.service_type = ${serviceType}
          AND es.is_active = 1
        )` : undefined
    )
    .groupBy(organizations.id)
    .all()
    
    // Filter out null values from services array and parse JSON
    allResults.push(...organizationResults.map(result => ({
      ...result,
      services: JSON.parse(result.services as string).filter(Boolean)
    })))
  }

  // Filter by distance if coordinates are provided
  const filteredResults = latitude && longitude ? 
    allResults.filter(result => {
      if (result.isOnline) return true
      if (!result.latitude || !result.longitude) return false
      
      const distance = calculateDistance(lat, lon, result.latitude, result.longitude)
      return distance <= maxDistance
    }) : allResults
  // Sort results - verified first, then by distance if coordinates provided
  const sortedResults = filteredResults.sort((a, b) => {
    // Prioritize verified results
    if (a.verificationStatus === 'verified' && b.verificationStatus !== 'verified') return -1
    if (a.verificationStatus !== 'verified' && b.verificationStatus === 'verified') return 1

    // Then sort by distance if coordinates are provided
    if (latitude && longitude && a.latitude && a.longitude && b.latitude && b.longitude) {
      const distanceA = calculateDistance(lat, lon, a.latitude, a.longitude)
      const distanceB = calculateDistance(lat, lon, b.latitude, b.longitude)
      return distanceA - distanceB
    }
    
    return 0
  })

  return {
    results: sortedResults
  }
})