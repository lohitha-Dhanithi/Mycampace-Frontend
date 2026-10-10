import { HRMS_SEED } from '../data/hrmsMockData'
import {
  APPRAISAL_CYCLE,
  DEPARTMENTS,
  inclusiveDays,
  metricsFor,
  ratingFor,
} from '../config/hrmsConfig'
import type {
  AppraisalReview,
  AttendanceStatus,
  DocumentStatus,
  HrmsDashboard,
  HrmsStore,
  LeaveDraft,
  LeaveRequest,
  MetricField,
  StaffDraft,
  StaffMember,
} from '../types'

export interface LeaveDecisionActor {
  staffId?: string
  asHr?: boolean
  actorName?: string
}

const STORAGE_KEY = 'mycampace_hrms_v1'
const LOOKUP_KEY = 'mycampace_hrms_lookups'
const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

function readStore(): HrmsStore {
  let store: HrmsStore
  let persist = false
  if (typeof window === 'undefined') {
    store = structuredClone(HRMS_SEED)
  } else {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      store = raw ? (JSON.parse(raw) as HrmsStore) : structuredClone(HRMS_SEED)
      persist = !raw
    } catch {
      store = structuredClone(HRMS_SEED)
      persist = true
    }
  }
  if (hydrateLeaveApprovers(store)) persist = true
  if (persist && typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  }
  return store
}

function writeStore(store: HrmsStore) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

function mutate<T>(change: (store: HrmsStore) => T): T {
  const store = readStore()
  const result = change(store)
  writeStore(store)
  return result
}

function uniqueNames(values: string[]) {
  const seen = new Set<string>()
  const result: string[] = []
  values.forEach((value) => {
    const name = value.trim()
    const key = name.toLowerCase()
    if (!name || seen.has(key)) return
    seen.add(key)
    result.push(name)
  })
  return result
}

function readLookups() {
  const fallback = {
    categories: ['Teaching', 'Non-Teaching'],
    departments: [...DEPARTMENTS],
  }
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(LOOKUP_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return {
      categories: uniqueNames(['Teaching', 'Non-Teaching', ...(parsed.categories || [])]),
      departments: uniqueNames([...DEPARTMENTS, ...(parsed.departments || [])]),
    }
  } catch {
    return fallback
  }
}

function addLookup(kind: 'categories' | 'departments', name: string) {
  const current = readLookups()
  const nextName = name.trim()
  if (!nextName) throw new Error('Enter a name.')
  const existing = current[kind].find((item) => item.toLowerCase() === nextName.toLowerCase())
  if (existing) return existing
  const next = { ...current, [kind]: [...current[kind], nextName] }
  localStorage.setItem(LOOKUP_KEY, JSON.stringify(next))
  return nextName
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function weighted(review: AppraisalReview, field: MetricField) {
  const totalWeight = review.metrics.reduce((sum, metric) => sum + metric.weight, 0) || 1
  const score = review.metrics.reduce((sum, metric) => sum + metric[field] * metric.weight, 0) / totalWeight
  return Math.round(score * 10) / 10
}

function staffName(store: HrmsStore, staffId: string) {
  return store.staff.find((person) => person.id === staffId)?.fullName || 'Staff'
}

function staffByManagerName(store: HrmsStore, reportingManager: string) {
  const key = reportingManager.trim().toLowerCase()
  if (!key || key === 'principal') return null
  return store.staff.find((person) => person.fullName.trim().toLowerCase() === key) || null
}

function nextManager(store: HrmsStore, from: StaffMember, applicantId: string) {
  const seen = new Set<string>([from.id])
  let cursor = from
  for (let hop = 0; hop < store.staff.length; hop += 1) {
    const manager = staffByManagerName(store, cursor.reportingManager)
    if (!manager || seen.has(manager.id)) return null
    seen.add(manager.id)
    if (manager.id !== applicantId) return manager
    cursor = manager
  }
  return null
}

function assignApprover(leave: LeaveRequest, store: HrmsStore, from: StaffMember) {
  const manager = nextManager(store, from, leave.staffId)
  if (manager) {
    leave.status = 'Pending Manager'
    leave.currentApproverId = manager.id
    leave.currentApproverName = manager.fullName
    return
  }
  leave.status = 'Pending HR'
  leave.currentApproverId = ''
  leave.currentApproverName = 'HR'
}

function clearApprover(leave: LeaveRequest) {
  leave.currentApproverId = ''
  leave.currentApproverName = ''
}

function hydrateLeaveApprovers(store: HrmsStore) {
  let changed = false
  store.leaves.forEach((leave) => {
    leave.timeline.forEach((entry) => {
      if (entry.step === 'Reporting Manager' && entry.actor && entry.actor !== 'Reporting Manager') {
        entry.step = entry.actor
        changed = true
      }
    })
    if (leave.status === 'Approved' || leave.status === 'Rejected') {
      if (leave.currentApproverId === undefined || leave.currentApproverName === undefined) {
        clearApprover(leave)
        changed = true
      }
      return
    }
    if (leave.status === 'Pending HR') {
      if (!leave.currentApproverName) {
        leave.currentApproverId = ''
        leave.currentApproverName = 'HR'
        changed = true
      }
      return
    }
    if (leave.status === 'Pending Manager' && !leave.currentApproverId) {
      const person = store.staff.find((item) => item.id === leave.staffId)
      if (!person) {
        leave.status = 'Pending HR'
        leave.currentApproverId = ''
        leave.currentApproverName = 'HR'
      } else {
        assignApprover(leave, store, person)
      }
      changed = true
    }
  })
  return changed
}

export function leaveAwaitingLabel(leave: LeaveRequest) {
  if (leave.status === 'Pending HR') return leave.currentApproverName || 'HR'
  if (leave.status === 'Pending Manager') return leave.currentApproverName || 'Reporting manager'
  return '—'
}

export const hrmsService = {
  getCategories() {
    return readLookups().categories
  },

  getDepartments() {
    return readLookups().departments
  },

  addCategory(name: string) {
    return addLookup('categories', name)
  },

  addDepartment(name: string) {
    return addLookup('departments', name)
  },

  async getDashboard(): Promise<HrmsDashboard> {
    await delay()
    const store = readStore()
    const active = store.staff.filter((person) => person.employmentStatus !== 'Separated')
    const presentToday = store.attendance.filter((row) => row.status === 'Present' || row.status === 'Late').length
    const departments = new Map<string, number>()
    active.forEach((person) => departments.set(person.department, (departments.get(person.department) || 0) + 1))
    const ratings = new Map<string, number>()
    store.appraisals
      .filter((review) => review.finalRating)
      .forEach((review) => ratings.set(review.finalRating, (ratings.get(review.finalRating) || 0) + 1))

    const expiringItems = [
      ...store.documents
        .filter((doc) => doc.status === 'Expired' || doc.status === 'Pending Review')
        .map((doc) => ({
          id: doc.id,
          label: doc.name,
          owner: staffName(store, doc.staffId),
          detail: doc.status === 'Expired' ? 'Document expired' : 'Awaiting vault verification',
          kind: 'Document',
        })),
      ...store.certifications
        .filter((cert) => cert.status === 'Expiring' || cert.status === 'Expired')
        .map((cert) => ({
          id: cert.id,
          label: cert.name,
          owner: staffName(store, cert.staffId),
          detail: cert.status === 'Expired' ? 'Certification expired' : `Valid until ${cert.validUntil || 'review'}`,
          kind: 'Certification',
        })),
    ]

    return {
      totalStaff: active.length,
      teaching: active.filter((person) => person.category === 'Teaching').length,
      nonTeaching: active.filter((person) => person.category !== 'Teaching').length,
      pendingLeaves: store.leaves.filter((leave) => leave.status === 'Pending Manager' || leave.status === 'Pending HR').length,
      appraisalsOpen: store.appraisals.filter((review) => review.stage !== 'HR Closed').length,
      appraisalsClosed: store.appraisals.filter((review) => review.stage === 'HR Closed').length,
      presentToday,
      attendanceTotal: store.attendance.length,
      expiringItems: expiringItems.slice(0, 6),
      leaveQueue: store.leaves.filter((leave) => leave.status === 'Pending Manager' || leave.status === 'Pending HR'),
      departmentCounts: Array.from(departments.entries()).map(([name, count]) => ({ name, count })),
      ratingCounts: Array.from(ratings.entries()).map(([rating, count]) => ({ rating, count })),
    }
  },

  async getStaff(filters: { search?: string; category?: string; status?: string; campus?: string } = {}) {
    await delay()
    const { search = '', category = 'all', status = 'all', campus = 'all' } = filters
    return readStore().staff.filter((person) => {
      const query = search.trim().toLowerCase()
      const matchesSearch =
        !query ||
        person.fullName.toLowerCase().includes(query) ||
        person.employeeCode.toLowerCase().includes(query) ||
        person.designation.toLowerCase().includes(query) ||
        person.department.toLowerCase().includes(query)
      return (
        matchesSearch &&
        (category === 'all' || person.category === category) &&
        (status === 'all' || person.employmentStatus === status) &&
        (campus === 'all' || person.campus === campus)
      )
    })
  },

  async getStaffById(id: string) {
    await delay()
    return readStore().staff.find((person) => person.id === id) || null
  },

  async ensureSelfStaff(user: { name?: string; email?: string; role?: string; platformRole?: string } | null) {
    const email = String(user?.email || '').trim().toLowerCase()
    if (!email) throw new Error('Sign in before opening My Portal.')
    const existing = readStore().staff.find((person) => person.email.toLowerCase() === email)
    if (existing) return existing
    return this.createStaff({
      fullName: user?.name || email.split('@')[0],
      category: 'Non-Teaching',
      designation: user?.platformRole || user?.role || 'Staff',
      department: 'Human Resources',
      campus: 'Hyderabad Main',
      email,
      phone: '',
      joiningDate: new Date().toISOString().slice(0, 10),
      employmentStatus: 'Active',
      reportingManager: 'Principal',
      qualification: '',
      experienceYears: 0,
    })
  },

  async getStaffProfile(id: string) {
    await delay()
    const store = readStore()
    const staff = store.staff.find((person) => person.id === id) || null
    if (!staff) return null
    return {
      staff,
      documents: store.documents.filter((doc) => doc.staffId === id),
      serviceEvents: store.serviceEvents
        .filter((event) => event.staffId === id)
        .sort((a, b) => b.date.localeCompare(a.date)),
      certifications: store.certifications.filter((cert) => cert.staffId === id),
      balances: store.balances.filter((balance) => balance.staffId === id),
      appraisal: store.appraisals.find((review) => review.staffId === id) || null,
    }
  },

  async createStaff(draft: StaffDraft) {
    await delay()
    return mutate((store) => {
      const numbers = store.staff.map((person) => Number(person.employeeCode.replace(/\D/g, '')) || 0)
      const employeeCode = `EMP-${Math.max(2400, ...numbers) + 1}`
      const staff: StaffMember = { id: uid('stf'), employeeCode, ...draft }
      store.staff.unshift(staff)
      ;(['Casual Leave', 'Sick Leave', 'Earned Leave'] as const).forEach((type) => {
        store.balances.push({
          staffId: staff.id,
          type,
          entitled: type === 'Earned Leave' ? 12 : type === 'Casual Leave' ? 12 : 8,
          used: 0,
        })
      })
      store.appraisals.unshift({
        id: uid('apr'),
        cycle: APPRAISAL_CYCLE,
        staffId: staff.id,
        staffName: staff.fullName,
        designation: staff.designation,
        department: staff.department,
        category: staff.category,
        stage: 'Self Review',
        selfScore: null,
        hodScore: null,
        principalScore: null,
        finalScore: null,
        finalRating: '',
        metrics: metricsFor(staff.category),
        comments: [],
      })
      store.serviceEvents.unshift({
        id: uid('svc'),
        staffId: staff.id,
        date: staff.joiningDate,
        title: 'Joined the institution',
        detail: `${staff.designation} · ${staff.department} · ${staff.campus}`,
      })
      return staff
    })
  },

  async updateStaff(id: string, draft: StaffDraft) {
    await delay()
    return mutate((store) => {
      const staff = store.staff.find((person) => person.id === id)
      if (!staff) return null
      Object.assign(staff, draft)
      const review = store.appraisals.find((item) => item.staffId === id)
      if (review) {
        review.staffName = staff.fullName
        review.designation = staff.designation
        review.department = staff.department
      }
      return staff
    })
  },

  async addDocument(staffId: string, input: { name: string; type: string; expiryDate: string }) {
    await delay()
    return mutate((store) => {
      const document = {
        id: uid('doc'),
        staffId,
        name: input.name,
        type: input.type,
        uploadedOn: new Date().toISOString().slice(0, 10),
        expiryDate: input.expiryDate,
        status: 'Pending Review' as DocumentStatus,
      }
      store.documents.unshift(document)
      return document
    })
  },

  async updateDocumentStatus(id: string, status: DocumentStatus) {
    await delay(40)
    return mutate((store) => {
      const document = store.documents.find((item) => item.id === id)
      if (document) document.status = status
      return document || null
    })
  },

  async addServiceEvent(staffId: string, input: { title: string; date: string; detail: string }) {
    await delay()
    return mutate((store) => {
      const event = { id: uid('svc'), staffId, ...input }
      store.serviceEvents.unshift(event)
      return event
    })
  },

  async getLeaves(status = 'all') {
    await delay()
    return readStore()
      .leaves.filter((leave) => status === 'all' || leave.status === status)
      .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
  },

  async getLeaveById(id: string) {
    await delay()
    const store = readStore()
    const leave = store.leaves.find((item) => item.id === id) || null
    if (!leave) return null
    return {
      leave,
      balances: store.balances.filter((balance) => balance.staffId === leave.staffId),
    }
  },

  async createLeave(draft: LeaveDraft) {
    await delay()
    const days = inclusiveDays(draft.from, draft.to)
    if (!draft.staffId || !draft.reason.trim() || days <= 0) {
      throw new Error('Choose a staff member, a valid date range, and a reason.')
    }
    return mutate((store) => {
      const person = store.staff.find((item) => item.id === draft.staffId)
      if (!person) throw new Error('Staff record was not found.')
      const leave: LeaveRequest = {
        id: uid('lv'),
        staffId: person.id,
        staffName: person.fullName,
        department: person.department,
        type: draft.type,
        from: draft.from,
        to: draft.to,
        days,
        reason: draft.reason.trim(),
        status: 'Pending Manager',
        appliedOn: new Date().toISOString().slice(0, 10),
        currentApproverId: '',
        currentApproverName: '',
        timeline: [
          {
            step: 'Submitted',
            actor: person.fullName,
            at: new Date().toISOString().slice(0, 10),
            comment: draft.reason.trim(),
            decision: 'Submitted',
          },
        ],
      }
      assignApprover(leave, store, person)
      store.leaves.unshift(leave)
      return leave
    })
  },

  previewFirstApprover(staffId: string) {
    const store = readStore()
    const person = store.staff.find((item) => item.id === staffId)
    if (!person) return null
    const manager = nextManager(store, person, person.id)
    return manager ? { name: manager.fullName, kind: 'manager' as const } : { name: 'HR', kind: 'hr' as const }
  },

  async getApprovalInbox(staffId: string) {
    await delay()
    return readStore()
      .leaves.filter((leave) => leave.status === 'Pending Manager' && leave.currentApproverId === staffId && leave.staffId !== staffId)
      .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn))
  },

  async decideLeave(id: string, action: 'approve' | 'reject', comment: string, actor: LeaveDecisionActor = {}) {
    await delay()
    return mutate((store) => {
      const leave = store.leaves.find((item) => item.id === id)
      if (!leave) throw new Error('Leave request was not found.')
      if (leave.status !== 'Pending Manager' && leave.status !== 'Pending HR') {
        throw new Error('This request is already closed.')
      }
      const note = comment.trim() || (action === 'approve' ? 'Approved.' : 'Rejected.')
      const today = new Date().toISOString().slice(0, 10)

      if (actor.asHr) {
        if (leave.status !== 'Pending HR') {
          throw new Error('HR can decide only after the reporting chain has approved.')
        }
        const step = 'HR Administrator'
        const actorName = actor.actorName?.trim() || step
        if (action === 'reject') {
          leave.status = 'Rejected'
          clearApprover(leave)
          leave.timeline.push({ step, actor: actorName, at: today, comment: note, decision: 'Rejected' })
          return leave
        }
        const balance = store.balances.find((item) => item.staffId === leave.staffId && item.type === leave.type)
        if (balance && balance.used + leave.days > balance.entitled) {
          throw new Error(`Not enough ${leave.type} balance. ${balance.entitled - balance.used} day(s) remaining.`)
        }
        if (balance) balance.used += leave.days
        leave.status = 'Approved'
        clearApprover(leave)
        leave.timeline.push({ step, actor: actorName, at: today, comment: note, decision: 'Approved' })
        const person = store.staff.find((item) => item.id === leave.staffId)
        if (person && leave.from <= today && leave.to >= today) person.employmentStatus = 'On Leave'
        return leave
      }

      if (!actor.staffId) throw new Error('Choose who is acting on this request.')
      if (leave.staffId === actor.staffId) throw new Error('You cannot approve your own leave.')
      if (leave.status !== 'Pending Manager' || leave.currentApproverId !== actor.staffId) {
        throw new Error('This request is not assigned to you.')
      }
      const manager = store.staff.find((person) => person.id === actor.staffId)
      if (!manager) throw new Error('Approver was not found.')
      if (action === 'reject') {
        leave.status = 'Rejected'
        clearApprover(leave)
        leave.timeline.push({ step: manager.fullName, actor: manager.fullName, at: today, comment: note, decision: 'Rejected' })
        return leave
      }
      leave.timeline.push({ step: manager.fullName, actor: manager.fullName, at: today, comment: note, decision: 'Approved' })
      assignApprover(leave, store, manager)
      return leave
    })
  },

  async getAppraisals(stage = 'all') {
    await delay()
    return readStore().appraisals.filter((review) => stage === 'all' || review.stage === stage)
  },

  async getAppraisalById(id: string) {
    await delay()
    return readStore().appraisals.find((review) => review.id === id) || null
  },

  async updateAppraisalMetric(id: string, index: number, value: number) {
    return mutate((store) => {
      const review = store.appraisals.find((item) => item.id === id)
      if (!review || review.stage === 'HR Closed') return null
      const field: MetricField =
        review.stage === 'Self Review' ? 'self' : review.stage === 'HOD Review' ? 'hod' : 'principal'
      const metric = review.metrics[index]
      if (metric) metric[field] = Math.min(5, Math.max(1, value))
      return review
    })
  },

  async advanceAppraisal(id: string, comment: string) {
    await delay()
    return mutate((store) => {
      const review = store.appraisals.find((item) => item.id === id)
      if (!review) throw new Error('Appraisal was not found.')
      if (review.stage === 'HR Closed') throw new Error('This appraisal cycle is already closed.')
      const field: MetricField =
        review.stage === 'Self Review' ? 'self' : review.stage === 'HOD Review' ? 'hod' : 'principal'
      if (review.metrics.some((metric) => metric[field] < 1)) {
        throw new Error('Score every metric from 1 to 5 before moving the review forward.')
      }
      const score = weighted(review, field)
      const note = comment.trim() || 'Review submitted.'
      review.comments.push({ stage: review.stage, comment: note, at: new Date().toISOString().slice(0, 10) })
      if (review.stage === 'Self Review') {
        review.selfScore = score
        review.stage = 'HOD Review'
      } else if (review.stage === 'HOD Review') {
        review.hodScore = score
        review.stage = 'Principal Review'
      } else {
        review.principalScore = score
        const finalScore = Math.round((((review.selfScore || 0) + (review.hodScore || 0) + score) / 3) * 10) / 10
        review.finalScore = finalScore
        review.finalRating = ratingFor(finalScore)
        review.stage = 'HR Closed'
      }
      return review
    })
  },

  async getAttendance() {
    await delay()
    const store = readStore()
    return { shifts: store.shifts, records: store.attendance }
  },

  async updateAttendance(id: string, status: AttendanceStatus) {
    await delay(40)
    return mutate((store) => {
      const record = store.attendance.find((item) => item.id === id)
      if (!record) return null
      record.status = status
      record.checkIn = status === 'Present' ? record.checkIn || '09:00' : status === 'Late' ? '09:20' : ''
      return record
    })
  },
}
