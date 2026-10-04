// src/modules/students/config/studentStatusConfig.js

export const STUDENT_STATUSES = [
  { id: 'Active', label: 'Active', color: 'success', description: 'Currently enrolled and attending classes' },
  { id: 'Inactive', label: 'Inactive', color: 'secondary', description: 'Temporarily dormant student record' },
  { id: 'On Leave', label: 'On Leave', color: 'warning', description: 'Authorized medical or academic sabbatical' },
  { id: 'Transferred', label: 'Transferred', color: 'purple', description: 'Transferred to another campus or school' },
  { id: 'Graduated', label: 'Graduated', color: 'success', description: 'Successfully graduated and completed program' },
  { id: 'Exited', label: 'Exited', color: 'destructive', description: 'Withdrawn or terminated from institution' },
  { id: 'Suspended', label: 'Suspended', color: 'destructive', description: 'Disciplinary suspension' },
]

export const VALID_STATUS_TRANSITIONS = {
  Active: ['Inactive', 'On Leave', 'Transferred', 'Graduated', 'Exited', 'Suspended'],
  Inactive: ['Active', 'Exited'],
  'On Leave': ['Active', 'Exited'],
  Suspended: ['Active', 'Exited'],
  Transferred: ['Active'],
  Graduated: [],
  Exited: ['Active'], // rare re-admission
}

export const STUDENT_TRANSFER_TYPES = [
  { id: 'Internal Campus', label: 'Internal Campus Transfer' },
  { id: 'Internal Section', label: 'Section Re-allocation' },
  { id: 'External Transfer', label: 'External Transfer to Another School' },
]

export const STUDENT_EXIT_TYPES = [
  { id: 'Graduation', label: 'Graduation / Course Completion' },
  { id: 'Parent Relocation', label: 'Parent Relocation' },
  { id: 'Transfer', label: 'Transfer to Another Board / Institution' },
  { id: 'Voluntary Withdrawal', label: 'Voluntary Withdrawal' },
  { id: 'Expulsion', label: 'Expulsion / Disciplinary Exit' },
  { id: 'Other', label: 'Other' },
]
