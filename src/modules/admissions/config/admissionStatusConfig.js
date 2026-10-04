// src/modules/admissions/config/admissionStatusConfig.js

export const LEAD_STAGES = [
  { id: 'New', label: 'New', color: 'info' },
  { id: 'Contacted', label: 'Contacted', color: 'secondary' },
  { id: 'Qualified', label: 'Qualified', color: 'warning' },
  { id: 'Counselling', label: 'Counselling', color: 'purple' },
  { id: 'Application Started', label: 'Application Started', color: 'info' },
  { id: 'Converted', label: 'Converted', color: 'success' },
  { id: 'Lost', label: 'Lost', color: 'destructive' },
]

export const LEAD_STAGE_TRANSITIONS = {
  New: ['Contacted', 'Lost'],
  Contacted: ['Qualified', 'Lost'],
  Qualified: ['Counselling', 'Application Started', 'Lost'],
  Counselling: ['Application Started', 'Lost'],
  'Application Started': ['Converted', 'Lost'],
  Converted: [],
  Lost: ['New', 'Contacted'],
}

export const APPLICATION_STATUSES = [
  { id: 'Draft', label: 'Draft', color: 'secondary' },
  { id: 'Submitted', label: 'Submitted', color: 'info' },
  { id: 'Under Review', label: 'Under Review', color: 'warning' },
  { id: 'Documents Required', label: 'Documents Required', color: 'warning' },
  { id: 'Approved', label: 'Approved', color: 'success' },
  { id: 'Conditionally Approved', label: 'Conditionally Approved', color: 'warning' },
  { id: 'Rejected', label: 'Rejected', color: 'destructive' },
  { id: 'Withdrawn', label: 'Withdrawn', color: 'secondary' },
  { id: 'Admitted', label: 'Admitted', color: 'success' },
  { id: 'Enrolled', label: 'Enrolled', color: 'success' },
]

export const ENQUIRY_STATUSES = [
  { id: 'New', label: 'New', color: 'info' },
  { id: 'In Progress', label: 'In Progress', color: 'warning' },
  { id: 'Qualified', label: 'Qualified', color: 'purple' },
  { id: 'Converted', label: 'Converted', color: 'success' },
  { id: 'Closed', label: 'Closed', color: 'destructive' },
]

export const COUNSELLING_STATUSES = [
  { id: 'Scheduled', label: 'Scheduled', color: 'info' },
  { id: 'Completed', label: 'Completed', color: 'success' },
  { id: 'Rescheduled', label: 'Rescheduled', color: 'warning' },
  { id: 'Cancelled', label: 'Cancelled', color: 'destructive' },
]

export const COUNSELLING_OUTCOMES = [
  { id: 'Interested', label: 'Interested' },
  { id: 'Needs Follow-up', label: 'Needs Follow-up' },
  { id: 'Application Recommended', label: 'Application Recommended' },
  { id: 'Not Interested', label: 'Not Interested' },
]

export const FOLLOWUP_STATUSES = [
  { id: 'Pending', label: 'Pending', color: 'warning' },
  { id: 'Completed', label: 'Completed', color: 'success' },
  { id: 'Overdue', label: 'Overdue', color: 'destructive' },
  { id: 'Cancelled', label: 'Cancelled', color: 'secondary' },
]

export const FOLLOWUP_TYPES = [
  { id: 'Call', label: 'Call' },
  { id: 'Email', label: 'Email' },
  { id: 'WhatsApp', label: 'WhatsApp' },
  { id: 'Meeting', label: 'Meeting' },
  { id: 'Campus Visit', label: 'Campus Visit' },
]

export const DOCUMENT_VERIFICATION_STATUSES = [
  { id: 'Pending', label: 'Pending Verification', color: 'warning' },
  { id: 'Verified', label: 'Verified', color: 'success' },
  { id: 'Rejected', label: 'Rejected', color: 'destructive' },
  { id: 'Required', label: 'Required', color: 'destructive' },
]

export const APPLICATION_WORKFLOW_TRANSITIONS = {
  Draft: ['Submitted', 'Withdrawn'],
  Submitted: ['Under Review', 'Documents Required', 'Withdrawn'],
  'Under Review': ['Documents Required', 'Approved', 'Conditionally Approved', 'Rejected', 'Withdrawn'],
  'Documents Required': ['Under Review', 'Withdrawn'],
  'Conditionally Approved': ['Approved', 'Rejected', 'Withdrawn'],
  Approved: ['Admitted', 'Withdrawn'],
  Admitted: ['Enrolled'],
  Enrolled: [],
  Rejected: ['Under Review'],
  Withdrawn: ['Draft'],
}
