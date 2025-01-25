import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

// User roles enum
export const UserRole = {
  USER: 'user',
  PROFESSIONAL: 'professional',
  HOSPITAL: 'hospital',
  ORGANIZATION: 'organization',
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin',
} as const

// Base profile table for all users
export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role', { enum: ['user', 'professional', 'hospital', 'organization', 'admin'] }).notNull().default('user'),
  photoUrl: text('photo_url'),
  phone: text('phone'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  bio: text('bio'),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Professionals table
export const professionals = sqliteTable('professionals', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  profileId: text('profile_id').references(() => profiles.id), // Used when professional creates their own profile
  phone: text('phone').notNull(),
  specialization: text('specialization').notNull(),
  qualifications: text('qualifications').notNull(),
  licenseNumber: text('license_number'),
  experience: integer('experience'),
  consultationFees: real('consultation_fees'),
  availableForOnline: integer('available_for_online', { mode: 'boolean' }).default(false),
  languages: text('languages').notNull(),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  isClaimable: integer('is_claimable', { mode: 'boolean' }).default(true),
  claimedBy: text('claimed_by').references(() => profiles.id), // Used when an existing profile is claimed by a professional
  verificationStatus: text('verification_status').default('pending'),
  averageRating: real('average_rating').default(0),
  totalReviews: integer('total_reviews').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

// Hospitals/Clinics table
export const hospitals = sqliteTable('hospitals', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').references(() => profiles.id),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  type: text('type').notNull(), // hospital, clinic, nursing home, etc.
  facilities: text('facilities'),
  emergencyServices: integer('emergency_services', { mode: 'boolean' }).default(false),
  accreditation: text('accreditation'),
  website: text('website'),
  openingHours: text('opening_hours'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  isClaimable: integer('is_claimable', { mode: 'boolean' }).default(true),
  claimedBy: text('claimed_by').references(() => profiles.id),
  verificationStatus: text('verification_status').default('pending'),
  averageRating: real('average_rating').default(0),
  totalReviews: integer('total_reviews').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})

// Organizations table
export const organizations = sqliteTable('organizations', {
  id: text('id').primaryKey(),
  profileId: text('profile_id').references(() => profiles.id),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  type: text('type').notNull(), // NGO, research, support group, etc.
  registrationNumber: text('registration_number'),
  website: text('website'),
  focusAreas: text('focus_areas'),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  country: text('country').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude'),
  isClaimable: integer('is_claimable', { mode: 'boolean' }).default(true),
  claimedBy: text('claimed_by').references(() => profiles.id),
  verificationStatus: text('verification_status').default('pending'),
  averageRating: real('average_rating').default(0),
  totalReviews: integer('total_reviews').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})
// Support Groups table
export const supportGroups = sqliteTable('support_groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  organizationId: text('organization_id').references(() => organizations.id),
  description: text('description').notNull(),
  meetingSchedule: text('meeting_schedule'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  onlineLink: text('online_link'),
  contactPerson: text('contact_person'),
  contactEmail: text('contact_email'),
  focusArea: text('focus_area').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  averageRating: real('average_rating').default(0),
  totalReviews: integer('total_reviews').default(0),
})
// Reviews table
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => profiles.id).notNull(),
  entityType: text('entity_type').notNull(), // professional, hospital, organization
  entityId: text('entity_id').notNull(),
  rating: integer('rating').notNull(),
  review: text('review'),
  visitDate: integer('visit_date', { mode: 'timestamp' }),
  isAnonymous: integer('is_anonymous', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Professional-Hospital affiliations
export const professionalAffiliations = sqliteTable('professional_affiliations', {
  id: text('id').primaryKey(),
  professionalId: text('professional_id').references(() => professionals.id).notNull(),
  hospitalId: text('hospital_id').references(() => hospitals.id).notNull(),
  startDate: integer('start_date', { mode: 'timestamp' }),
  endDate: integer('end_date', { mode: 'timestamp' }),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
})

// Claim requests table
export const claimRequests = sqliteTable('claim_requests', {
  id: text('id').primaryKey(),
  entityType: text('entity_type', { enum: ['professional', 'hospital', 'organization'] }).notNull(),
  entityId: text('entity_id').notNull(),
  requestedBy: text('requested_by').references(() => profiles.id).notNull(),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).default('pending'),
  verificationDocuments: text('verification_documents'), // JSON string containing document URLs
  notes: text('notes'),
  reviewedBy: text('reviewed_by').references(() => profiles.id),
  rejectionReason: text('rejection_reason'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})



// Service types enum
export const ServiceType = {
  PSYCHIATRIST: 'psychiatrist',
  PSYCHOLOGIST: 'psychologist',
  THERAPIST: 'therapist',
  COUNSELOR: 'counselor',
  ADDICTION_COUNSELING: 'addiction-counseling',
  CHILD_ADOLESCENT: 'child-adolescent',
  FAMILY_COUNSELING: 'family-counseling',
  RELATIONSHIP_COUNSELING: 'relationship-counseling',
  GRIEF_COUNSELING: 'grief-counseling',
  TRAUMA_COUNSELING: 'trauma-counseling',
  SUPPORT_GROUP: 'support-group',
  PEER_SUPPORT: 'peer-support',
  CRISIS_HELPLINE: 'crisis-helpline',
  EMERGENCY: 'emergency',
} as const

// Entity services table
export const entityServices = sqliteTable('entity_services', {
  id: text('id').primaryKey(),
  entityType: text('entity_type', { enum: ['professional', 'hospital', 'organization'] }).notNull(),
  entityId: text('entity_id').notNull(),
  serviceType: text('service_type', {
    enum: [
      'psychiatrist',
      'psychologist',
      'therapist',
      'counselor',
      'addiction-counseling',
      'child-adolescent',
      'family-counseling',
      'relationship-counseling',
      'grief-counseling',
      'trauma-counseling',
      'support-group',
      'peer-support',
      'crisis-helpline',
      'emergency'
    ]
  }).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})
