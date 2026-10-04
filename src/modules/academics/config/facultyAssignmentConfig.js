// src/modules/academics/config/facultyAssignmentConfig.js

export const ASSIGNMENT_TYPES = [
  { id: 'primary', label: 'Primary Teacher', badgeVariant: 'default', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'subject', label: 'Subject Teacher', badgeVariant: 'info', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'substitute', label: 'Substitute Teacher', badgeVariant: 'warning', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'lab', label: 'Lab Instructor', badgeVariant: 'purple', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'co_teacher', label: 'Co-Teacher', badgeVariant: 'emerald', color: 'bg-teal-50 text-teal-700 border-teal-200' },
]

export const FACULTY_ASSIGNMENT_STATUSES = {
  DRAFT: 'Draft',
  ASSIGNED: 'Assigned',
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  REMOVED: 'Removed',
}

export const FACULTY_STATUS_CONFIG = {
  Draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  Assigned: { label: 'Assigned', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  Active: { label: 'Active', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Completed: { label: 'Completed', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  Removed: { label: 'Removed', color: 'bg-red-50 text-red-700 border-red-200' },
}

export const WORKLOAD_THRESHOLDS = {
  MIN_HOURS: 14,
  MAX_HOURS: 22,
  OVERLOAD_HOURS: 26,
}

export const WORKLOAD_STATUSES = {
  UNDERUTILIZED: { label: 'Underutilized', color: 'bg-amber-50 text-amber-700 border-amber-200', max: 15 },
  BALANCED: { label: 'Balanced', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', min: 16, max: 23 },
  HIGH: { label: 'High Workload', color: 'bg-red-50 text-red-700 border-red-200', min: 24 },
}
