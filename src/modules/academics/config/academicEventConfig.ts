// src/modules/academics/config/academicEventConfig.js

export const EVENT_TYPES = [
  { id: 'session_start', label: 'Academic Session Start', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'session_end', label: 'Academic Session End', color: 'bg-slate-50 text-slate-700 border-slate-200' },
  { id: 'holiday', label: 'Holiday', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'examination', label: 'Examination', color: 'bg-red-50 text-red-700 border-red-200' },
  { id: 'assessment', label: 'Assessment / Test', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'admission', label: 'Admission Event', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'parent_meeting', label: 'Parent Meeting (PTM)', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'faculty_meeting', label: 'Faculty Meeting', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { id: 'academic_event', label: 'Academic Event / Symposium', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { id: 'other', label: 'Other', color: 'bg-slate-100 text-slate-600 border-slate-300' },
]

export const EVENT_STATUSES = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export const EVENT_STATUS_CONFIG = {
  Draft: { label: 'Draft', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  Published: { label: 'Published', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Completed: { label: 'Completed', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  Cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700 border-red-200' },
}

export const AUDIENCE_TYPES = [
  { id: 'all', label: 'All Stakeholders' },
  { id: 'students', label: 'Students' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'parents', label: 'Parents' },
  { id: 'administration', label: 'Administration' },
]
