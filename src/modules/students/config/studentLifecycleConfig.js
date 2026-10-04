// src/modules/students/config/studentLifecycleConfig.js

export const TRANSFER_TYPES = {
  INTERNAL_CAMPUS: 'Internal Campus Transfer',
  INTERNAL_SECTION: 'Internal Section Transfer',
  EXTERNAL: 'External Institution Transfer',
}

export const TRANSFER_STATUSES = {
  REQUESTED: 'Requested',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
}

export const EXIT_TYPES = {
  GRADUATION: 'Graduation',
  TRANSFER: 'Transfer',
  WITHDRAWAL: 'Withdrawal',
  EXPULSION: 'Expulsion',
  OTHER: 'Other',
}

export const EXIT_STATUSES = {
  REQUESTED: 'Requested',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
}

export const CLEARANCE_OBLIGATIONS = [
  { id: 'feesCleared', label: 'Accounts & Fee Dues Clearance', required: true },
  { id: 'libraryCleared', label: 'Library Books & Dues Clearance', required: true },
  { id: 'labEquipmentCleared', label: 'Science / Computer Lab Equipment Return', required: true },
  { id: 'documentsReturned', label: 'Original Certificates / ID Return Clearance', required: true },
]
