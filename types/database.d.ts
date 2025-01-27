export type UserRoleType = 'user' | 'professional' | 'hospital' | 'organization' | 'admin';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRoleType;
  photoUrl?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  bio?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Professional {
  id: string;
  profileId: string;
  name: string;
  phone: string;
  specialization: string;
  qualifications: string;
  licenseNumber?: string;
  experience?: number;
  consultationFees?: number;
  availableForOnline: boolean;
  languages: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  isClaimable: boolean;
  claimedBy?: string;
  verificationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hospital {
  id: string;
  profileId?: string;
  name: string;
  phone: string;
  type: string;
  facilities?: string;
  emergencyServices: boolean;
  accreditation?: string;
  website?: string;
  openingHours?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isClaimable: boolean;
  claimedBy?: string;
  verificationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  profileId?: string;
  name: string;
  phone: string;
  type: string;
  registrationNumber?: string;
  website?: string;
  focusAreas?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isClaimable: boolean;
  claimedBy?: string;
  verificationStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  entityType: string;
  entityId: string;
  rating: number;
  review?: string;
  visitDate?: Date;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfessionalAffiliation {
  id: string;
  professionalId: string;
  hospitalId: string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
}

export interface SupportGroup {
  id: string;
  name: string;
  organizationId?: string;
  description: string;
  meetingSchedule?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  onlineLink?: string;
  contactPerson?: string;
  contactEmail?: string;
  focusArea: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClaimRequest {
  id: string;
  entityType: 'professional' | 'hospital' | 'organization';
  entityId: string;
  requestedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  verificationDocuments?: string; // JSON string containing document URLs
  notes?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
