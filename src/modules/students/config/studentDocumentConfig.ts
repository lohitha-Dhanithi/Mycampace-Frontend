// src/modules/students/config/studentDocumentConfig.js

export const STUDENT_DOCUMENT_TYPES = [
  { id: 'doc-type-id-proof', name: 'Identity Proof (Aadhaar / Passport)', isRequired: true, category: 'Identification' },
  { id: 'doc-type-address', name: 'Address Proof (Utility Bill / Passport)', isRequired: true, category: 'Identification' },
  { id: 'doc-type-birth-cert', name: 'Birth Certificate', isRequired: true, category: 'Legal' },
  { id: 'doc-type-prev-qual', name: 'Previous Qualification / Marksheet', isRequired: true, category: 'Academic' },
  { id: 'doc-type-tc', name: 'Transfer Certificate (TC)', isRequired: true, category: 'Academic' },
  { id: 'doc-type-photo', name: 'Passport Size Photograph', isRequired: true, category: 'Personal' },
  { id: 'doc-type-medical', name: 'Medical Certificate & Immunization Record', isRequired: false, category: 'Health' },
  { id: 'doc-type-other', name: 'Other Supporting Document', isRequired: false, category: 'General' },
]

export const DOCUMENT_STATUSES = {
  REQUIRED: 'Required',
  PENDING: 'Pending',
  UPLOADED: 'Uploaded',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
  EXPIRED: 'Expired',
}

export const DOCUMENT_STATUS_CONFIG = {
  Required: {
    label: 'Required',
    badgeVariant: 'warning',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Mandatory document pending initial upload by guardian or student',
  },
  Pending: {
    label: 'Pending',
    badgeVariant: 'warning',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    description: 'Document submission awaiting reviewer verification',
  },
  Uploaded: {
    label: 'Uploaded',
    badgeVariant: 'info',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Uploaded successfully and queued for staff scrutiny',
  },
  Verified: {
    label: 'Verified',
    badgeVariant: 'success',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Formally audited and verified against physical/original credentials',
  },
  Rejected: {
    label: 'Rejected',
    badgeVariant: 'destructive',
    className: 'bg-red-50 text-red-700 border-red-200',
    description: 'Rejected due to legibility or validity issues; re-upload requested',
  },
  Expired: {
    label: 'Expired',
    badgeVariant: 'destructive',
    className: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Document validity has lapsed and requires renewal',
  },
}
