export interface SearchParams {
  serviceType?: string
  entityType?: string
  maxDistance?: string
  latitude?: number
  longitude?: number
}

export type EntityType = 'professional' | 'hospital' | 'organization' | 'support-group'

export interface SearchResult {
  id: string
  name: string
  type: EntityType
  specialization?: string | null
  city?: string | null
  phone?: string | null
  state?: string | null
  address?: string | null
  isOnline?: boolean
  latitude?: number | null
  longitude?: number | null
  verificationStatus?: string | null
  services?: string[]
  claimedBy?: string | null
  isClaimable?: boolean
}