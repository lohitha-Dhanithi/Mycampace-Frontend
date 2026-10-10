import type { AppraisalMetric, LeaveType, StaffCategory } from '../types'

export const APPRAISAL_CYCLE = 'Annual Appraisal 2026-27'
export const ATTENDANCE_DATE = '2026-10-09'

export const CAMPUSES = ['Hyderabad Main', 'Bengaluru', 'Chennai']
export const DEPARTMENTS = [
  'Physics',
  'Mathematics',
  'English',
  'Biology',
  'Commerce',
  'Human Resources',
  'Accounts',
  'Laboratory',
]
export const LEAVE_TYPES: LeaveType[] = [
  'Casual Leave',
  'Sick Leave',
  'Earned Leave',
  'On Duty',
  'Compensatory Off',
]
export const DOCUMENT_TYPES = [
  'Appointment Letter',
  'Aadhaar',
  'PAN',
  'Degree Certificate',
  'Experience Letter',
  'ID Proof',
]

export const STATUS_CLASS: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Valid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'HR Closed': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Outstanding: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Exceeds Expectations': 'bg-blue-50 text-blue-700 border-blue-200',
  Probation: 'bg-amber-50 text-amber-700 border-amber-200',
  'Pending Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'Pending Manager': 'bg-amber-50 text-amber-700 border-amber-200',
  'Pending HR': 'bg-amber-50 text-amber-700 border-amber-200',
  Expiring: 'bg-amber-50 text-amber-700 border-amber-200',
  Late: 'bg-amber-50 text-amber-700 border-amber-200',
  'Meets Expectations': 'bg-slate-100 text-slate-700 border-slate-200',
  'On Leave': 'bg-blue-50 text-blue-700 border-blue-200',
  'Self Review': 'bg-slate-100 text-slate-700 border-slate-200',
  'HOD Review': 'bg-blue-50 text-blue-700 border-blue-200',
  'Principal Review': 'bg-violet-50 text-violet-700 border-violet-200',
  Teaching: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Non-Teaching': 'bg-slate-100 text-slate-700 border-slate-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Expired: 'bg-red-50 text-red-700 border-red-200',
  Absent: 'bg-red-50 text-red-700 border-red-200',
  Separated: 'bg-red-50 text-red-700 border-red-200',
  'Needs Improvement': 'bg-red-50 text-red-700 border-red-200',
}

export const TEACHING_METRICS: AppraisalMetric[] = [
  { name: 'Teaching effectiveness', weight: 30, self: 0, hod: 0, principal: 0 },
  { name: 'Student feedback', weight: 20, self: 0, hod: 0, principal: 0 },
  { name: 'Subject results', weight: 20, self: 0, hod: 0, principal: 0 },
  { name: 'Punctuality & attendance', weight: 15, self: 0, hod: 0, principal: 0 },
  { name: 'Professional development', weight: 15, self: 0, hod: 0, principal: 0 },
]

export const NON_TEACHING_METRICS: AppraisalMetric[] = [
  { name: 'Service quality', weight: 30, self: 0, hod: 0, principal: 0 },
  { name: 'Process compliance', weight: 25, self: 0, hod: 0, principal: 0 },
  { name: 'Attendance reliability', weight: 25, self: 0, hod: 0, principal: 0 },
  { name: 'Peer feedback', weight: 20, self: 0, hod: 0, principal: 0 },
]

export function metricsFor(category: StaffCategory): AppraisalMetric[] {
  const source = category === 'Teaching' ? TEACHING_METRICS : NON_TEACHING_METRICS
  return source.map((metric) => ({ ...metric }))
}

export function ratingFor(score: number) {
  if (score >= 4.5) return 'Outstanding'
  if (score >= 3.8) return 'Exceeds Expectations'
  if (score >= 3) return 'Meets Expectations'
  return 'Needs Improvement'
}

export function inclusiveDays(from: string, to: string) {
  const start = new Date(`${from}T00:00:00`)
  const end = new Date(`${to}T00:00:00`)
  const diff = Math.round((end.getTime() - start.getTime()) / 86400000) + 1
  return diff > 0 ? diff : 0
}

export function formatDisplayDate(value: string) {
  if (!value) return '—'
  const date = new Date(`${value.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
