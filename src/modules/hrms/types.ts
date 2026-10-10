export type StaffCategory = string
export type EmploymentStatus = 'Active' | 'On Leave' | 'Probation' | 'Separated'
export type DocumentStatus = 'Verified' | 'Pending Review' | 'Expired'
export type CertificationStatus = 'Valid' | 'Expiring' | 'Expired'
export type LeaveType = 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'On Duty' | 'Compensatory Off'
export type LeaveStatus = 'Pending Manager' | 'Pending HR' | 'Approved' | 'Rejected'
export type AppraisalStage = 'Self Review' | 'HOD Review' | 'Principal Review' | 'HR Closed'
export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'On Leave'
export type MetricField = 'self' | 'hod' | 'principal'

export interface StaffMember {
  id: string
  employeeCode: string
  fullName: string
  category: StaffCategory
  designation: string
  department: string
  campus: string
  email: string
  phone: string
  joiningDate: string
  employmentStatus: EmploymentStatus
  reportingManager: string
  qualification: string
  experienceYears: number
}

export interface StaffDocument {
  id: string
  staffId: string
  name: string
  type: string
  uploadedOn: string
  expiryDate: string
  status: DocumentStatus
}

export interface ServiceEvent {
  id: string
  staffId: string
  date: string
  title: string
  detail: string
}

export interface Certification {
  id: string
  staffId: string
  name: string
  issuer: string
  issuedOn: string
  validUntil: string
  status: CertificationStatus
}

export interface LeaveBalance {
  staffId: string
  type: LeaveType
  entitled: number
  used: number
}

export interface LeaveTimelineEntry {
  step: string
  actor: string
  at: string
  comment: string
  decision: string
}

export interface LeaveRequest {
  id: string
  staffId: string
  staffName: string
  department: string
  type: LeaveType
  from: string
  to: string
  days: number
  reason: string
  status: LeaveStatus
  appliedOn: string
  currentApproverId: string
  currentApproverName: string
  timeline: LeaveTimelineEntry[]
}

export interface AppraisalMetric {
  name: string
  weight: number
  self: number
  hod: number
  principal: number
}

export interface AppraisalComment {
  stage: AppraisalStage
  comment: string
  at: string
}

export interface AppraisalReview {
  id: string
  cycle: string
  staffId: string
  staffName: string
  designation: string
  department: string
  category: StaffCategory
  stage: AppraisalStage
  selfScore: number | null
  hodScore: number | null
  principalScore: number | null
  finalScore: number | null
  finalRating: string
  metrics: AppraisalMetric[]
  comments: AppraisalComment[]
}

export interface Shift {
  id: string
  name: string
  start: string
  end: string
  campus: string
  assigned: number
}

export interface AttendanceRecord {
  id: string
  staffId: string
  staffName: string
  department: string
  date: string
  shift: string
  status: AttendanceStatus
  checkIn: string
  checkOut: string
}

export interface HrmsStore {
  staff: StaffMember[]
  documents: StaffDocument[]
  serviceEvents: ServiceEvent[]
  certifications: Certification[]
  balances: LeaveBalance[]
  leaves: LeaveRequest[]
  appraisals: AppraisalReview[]
  shifts: Shift[]
  attendance: AttendanceRecord[]
}

export interface StaffDraft {
  fullName: string
  category: StaffCategory
  designation: string
  department: string
  campus: string
  email: string
  phone: string
  joiningDate: string
  employmentStatus: EmploymentStatus
  reportingManager: string
  qualification: string
  experienceYears: number
}

export interface LeaveDraft {
  staffId: string
  type: LeaveType
  from: string
  to: string
  reason: string
}

export interface HrmsDashboard {
  totalStaff: number
  teaching: number
  nonTeaching: number
  pendingLeaves: number
  appraisalsOpen: number
  appraisalsClosed: number
  presentToday: number
  attendanceTotal: number
  expiringItems: { id: string; label: string; owner: string; detail: string; kind: string }[]
  leaveQueue: LeaveRequest[]
  departmentCounts: { name: string; count: number }[]
  ratingCounts: { rating: string; count: number }[]
}
