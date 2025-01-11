import { z } from 'zod'

export const claimRequestSchema = z.object({
  id: z.string().uuid(),
  entityType: z.enum(['professional', 'hospital', 'organization']),
  entityId: z.string().uuid(),
  requestedBy: z.string().uuid(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  verificationDocuments: z.string().optional(), // JSON string containing document URLs
  notes: z.string().optional(),
  reviewedBy: z.string().uuid().optional(),
  rejectionReason: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
})

export type ClaimRequestSchemaType = z.infer<typeof claimRequestSchema>

// Schema for creating a new claim request
export const createClaimRequestSchema = claimRequestSchema.omit({
  id: true,
  status: true,
  reviewedBy: true,
  rejectionReason: true,
  createdAt: true,
  updatedAt: true
}).extend({
  verificationDocuments: z.array(z.string().url()).optional(), // Array of document URLs that will be JSON stringified
})

// Schema for updating a claim request status
export const updateClaimRequestStatusSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  rejectionReason: z.string().optional().nullable(),
  notes: z.string().optional().nullable()
})
