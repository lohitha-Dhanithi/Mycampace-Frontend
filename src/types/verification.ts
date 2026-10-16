// src/types/verification.ts
// Shapes returned by the backend /verification and /superadmin/verifications APIs.
// The server decides requirements, status and access; the UI only renders them.

export type VerificationStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
export type DocumentReviewStatus = 'Pending' | 'Accepted' | 'Rejected'

/** Decided by the server on sign-in (/auth/me). Never derived or elevated client-side. */
export type AccessLevel = 'NONE' | 'APPLICANT_RESTRICTED' | 'INSTITUTION_ADMIN' | 'SUPERADMIN'

export interface DocumentMeta {
  id: string
  originalName: string
  mimeType: string
  sizeBytes: number
  uploadedAt: string
  reviewStatus: DocumentReviewStatus
  reviewNote: string | null
}

export interface RequirementItem {
  key: string
  number: number
  label: string
  group: string
  description: string
  kind: 'upload' | 'data'
  required: boolean
  requirementReason: string
  formats: string[]
  maxBytes: number
  campusId: string | null
  campusName: string | null
  document: DocumentMeta | null
  done: boolean
}

export interface RequirementsSummary {
  requiredTotal: number
  requiredDone: number
  optionalTotal: number
  optionalDone: number
  missing: { key: string; campusId: string | null; label: string }[]
  rejected: { key: string; campusId: string | null; label: string; note: string | null }[]
  canSubmit: boolean
}

export interface VerificationStatusView {
  /** Issued by the backend on first submission; null before that. */
  applicationId: string | null
  status: VerificationStatus
  submittedAt: string | null
  reviewedAt: string | null
  note: string | null
  round: number
  editable: boolean
  onboardingStep: number
  /** Only present on the submit response: true when the backend is in test mode and allows self approve/decline. */
  demoReview?: boolean
}

export interface RequirementsResponse {
  items: RequirementItem[]
  summary: RequirementsSummary
  status: VerificationStatusView
}

export interface ReviewPack {
  organization: {
    id: string
    name: string
    legalName: string | null
    type: string
    country: string
    state: string
    city: string
    address: string | null
    postalCode: string | null
    taxId: string | null
    domains: string[]
    primaryContact: { name?: string; email?: string; phone?: string } | null
  }
  institutions: {
    id: string
    name: string
    code: string
    type: string
    affiliation: string | null
    email: string | null
    phone: string | null
    campuses: { id: string; name: string; code: string; city: string; address: string | null }[]
  }[]
  products: { productId: string; status: string; plan: string | null }[]
  requirements: RequirementItem[]
  summary: RequirementsSummary
  status: VerificationStatusView
  admin?: { name: string; email: string; mobile: string | null } | null
}

/** Returned by approve / decline: the saved status plus whether the notification email was accepted by the mail provider. */
export type DecisionResponse = VerificationStatusView & { emailSent: boolean }

export interface QueueItem {
  id: string
  applicationId: string | null
  name: string
  type: string
  city: string
  state: string
  status: VerificationStatus
  round: number
  submittedAt: string | null
  reviewedAt: string | null
  documentCount: number
  admin: { name: string; email: string } | null
}

export interface QueueResponse {
  total: number
  page: number
  pageSize: number
  counts: Partial<Record<VerificationStatus, number>>
  items: QueueItem[]
}

export interface UploadSlot {
  progress: number
  status: 'uploading' | 'failed' | 'done'
  error?: string
}

/** One upload slot per requirement row (document key + optional campus). */
export const slotKey = (key: string, campusId?: string | null) => `${key}::${campusId ?? ''}`
