// src/modules/admissions/services/applicationService.js
import { INITIAL_APPLICATIONS } from '../data/applicationMockData'
import { APPLICATION_WORKFLOW_TRANSITIONS } from '../config/admissionStatusConfig'

let applications = [...INITIAL_APPLICATIONS]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Real completion calculation based on required sections and fields
 */
export function calculateApplicationCompletion(app) {
  if (!app) return { percentage: 0, sections: {} }

  const sections = {
    personal: Boolean(app.personal?.firstName && app.personal?.lastName && app.personal?.dob && app.personal?.gender),
    contact: Boolean(app.contact?.email && app.contact?.mobile && app.contact?.address && app.contact?.city),
    academic: Boolean(app.previousAcademic?.previousInstitution && app.previousAcademic?.qualification && app.previousAcademic?.passingYear),
    program: Boolean(app.academicInterest?.programId && app.academicInterest?.courseId && app.academicInterest?.campusId),
    guardian: Boolean(app.guardian?.name && app.guardian?.relationship && app.guardian?.mobile),
    declaration: Boolean(app.declaration?.confirmed),
  }

  const sectionKeys = Object.keys(sections)
  const completedCount = sectionKeys.filter((k) => sections[k]).length
  const percentage = Math.round((completedCount / sectionKeys.length) * 100)

  return { percentage, sections }
}

export const applicationService = {
  getApplications: async (filters: any = {}) => {
    await delay(120)
    let result = [...applications]

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter(
        (a) => a.academicInterest?.campusId === filters.campusId || !a.academicInterest?.campusId
      )
    }

    if (filters.academicYearId && filters.academicYearId !== 'all') {
      result = result.filter(
        (a) => a.academicInterest?.academicYearId === filters.academicYearId || !a.academicInterest?.academicYearId
      )
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (a) =>
          a.applicantName?.toLowerCase().includes(q) ||
          a.applicationNumber?.toLowerCase().includes(q) ||
          a.personal?.firstName?.toLowerCase().includes(q) ||
          a.personal?.lastName?.toLowerCase().includes(q) ||
          a.academicInterest?.programName?.toLowerCase().includes(q) ||
          a.contact?.email?.toLowerCase().includes(q) ||
          a.contact?.mobile?.includes(q)
      )
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((a) => a.status.toLowerCase() === filters.status.toLowerCase())
    }

    if (filters.programId && filters.programId !== 'all') {
      result = result.filter((a) => a.academicInterest?.programId === filters.programId)
    }

    if (filters.reviewerId && filters.reviewerId !== 'all') {
      result = result.filter((a) => a.assignedReviewerId === filters.reviewerId)
    }

    return result
  },

  getApplicationById: async (id) => {
    await delay(100)
    return applications.find((a) => a.id === id) || null
  },

  createApplication: async (data) => {
    await delay(200)
    const newId = `app-${Date.now()}`
    const applicantName = `${data.personal?.firstName || ''} ${data.personal?.lastName || ''}`.trim() || 'New Applicant'

    const newApp = {
      id: newId,
      applicationNumber: `APP-2026-${String(applications.length + 1).padStart(3, '0')}`,
      status: 'Draft',
      applicationDate: new Date().toISOString().split('T')[0],
      applicantName,
      leadId: data.leadId || null,
      enquiryId: data.enquiryId || null,
      counsellingId: data.counsellingId || null,
      studentId: null,
      assignedReviewerId: 'usr-2',
      assignedReviewerName: 'Dr. Radhakrishnan Murthy',
      personal: data.personal || {},
      contact: data.contact || {},
      academicInterest: data.academicInterest || {},
      previousAcademic: data.previousAcademic || {},
      guardian: data.guardian || {},
      declaration: data.declaration || {},
      reviewData: null,
      admissionDetails: null,
      communications: [
        {
          id: `comm-${Date.now()}`,
          type: 'Notification',
          recipient: data.contact?.email || 'Applicant',
          sentBy: 'System',
          date: new Date().toLocaleString(),
          status: 'Delivered',
          subject: 'Application Draft Created',
        },
      ],
    }

    applications = [newApp, ...applications]
    return newApp
  },

  updateApplication: async (id, updatedData) => {
    await delay(180)
    applications = applications.map((a) => {
      if (a.id === id) {
        const merged = { ...a, ...updatedData }
        if (updatedData.personal?.firstName || updatedData.personal?.lastName) {
          merged.applicantName = `${updatedData.personal?.firstName || a.personal?.firstName || ''} ${updatedData.personal?.lastName || a.personal?.lastName || ''}`.trim()
        }
        return merged
      }
      return a
    })
    return applications.find((a) => a.id === id)
  },

  submitApplication: async (id) => {
    await delay(200)
    const app = applications.find((a) => a.id === id)
    if (!app) throw new Error('Application not found')

    app.status = 'Submitted'
    app.communications = [
      {
        id: `comm-${Date.now()}`,
        type: 'Email',
        recipient: app.contact?.email || 'Applicant',
        sentBy: 'System Gateway',
        date: new Date().toLocaleString(),
        status: 'Delivered',
        subject: `Application ${app.applicationNumber} Submitted Successfully`,
      },
      ...(app.communications || []),
    ]
    return { ...app }
  },

  updateApplicationStatus: async (id, newStatus) => {
    await delay(180)
    const app = applications.find((a) => a.id === id)
    if (!app) throw new Error('Application not found')

    const allowed = APPLICATION_WORKFLOW_TRANSITIONS[app.status] || []
    if (allowed.length > 0 && !allowed.includes(newStatus)) {
      throw new Error(`Cannot transition application from "${app.status}" to "${newStatus}"`)
    }

    app.status = newStatus
    return { ...app }
  },

  reviewApplication: async (id, { decision, comments, conditionalTerms, reviewerName }) => {
    await delay(200)
    const app = applications.find((a) => a.id === id)
    if (!app) throw new Error('Application not found')

    let nextStatus = app.status
    if (decision === 'Approve') nextStatus = 'Approved'
    else if (decision === 'Conditionally Approve') nextStatus = 'Conditionally Approved'
    else if (decision === 'Request Documents') nextStatus = 'Documents Required'
    else if (decision === 'Reject') nextStatus = 'Rejected'

    app.status = nextStatus
    app.reviewData = {
      reviewerComments: comments,
      conditionalTerms: conditionalTerms || '',
      decisionDate: new Date().toISOString().split('T')[0],
      decisionBy: reviewerName || 'Review Board',
    }

    app.communications = [
      {
        id: `comm-${Date.now()}`,
        type: 'Email',
        recipient: app.contact?.email || 'Applicant',
        sentBy: reviewerName || 'Admissions Reviewer',
        date: new Date().toLocaleString(),
        status: 'Delivered',
        subject: `Decision Update on Application ${app.applicationNumber}: ${nextStatus}`,
      },
      ...(app.communications || []),
    ]

    return { ...app }
  },

  convertToAdmission: async (id, admissionData) => {
    await delay(250)
    const app = applications.find((a) => a.id === id)
    if (!app) throw new Error('Application not found')

    app.status = 'Admitted'
    app.admissionDetails = {
      admissionNumber: admissionData.admissionNumber || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      rollNumber: admissionData.rollNumber || `ROLL-${Math.floor(10 + Math.random() * 90)}`,
      allocatedSection: admissionData.section || 'Section A',
      admissionDate: admissionData.admissionDate || new Date().toISOString().split('T')[0],
      admissionNotes: admissionData.admissionNotes || 'Admission officially confirmed by Admissions Committee.',
    }

    app.communications = [
      {
        id: `comm-${Date.now()}`,
        type: 'Email',
        recipient: app.contact?.email,
        sentBy: 'Registrar & Admissions',
        date: new Date().toLocaleString(),
        status: 'Delivered',
        subject: `Welcome to MyCampace! Admission Confirmed (${app.admissionDetails.admissionNumber})`,
      },
      ...(app.communications || []),
    ]

    return { ...app }
  },

  enrollStudentFromAdmission: async (id) => {
    await delay(250)
    const app = applications.find((a) => a.id === id)
    if (!app) throw new Error('Application not found')

    app.status = 'Enrolled'
    const studentId = `stu-${Date.now()}`
    app.studentId = studentId

    return {
      application: { ...app },
      studentRecord: {
        id: studentId,
        studentNumber: app.admissionDetails?.rollNumber || `STU-${Date.now()}`,
        admissionNumber: app.admissionDetails?.admissionNumber,
        fullName: app.applicantName,
        email: app.contact?.email,
        phone: app.contact?.mobile,
        campus: app.academicInterest?.campusName,
        program: app.academicInterest?.programName,
        course: app.academicInterest?.courseName,
        academicYear: app.academicInterest?.academicYearName,
        section: app.admissionDetails?.allocatedSection,
        status: 'Active',
      },
    }
  },
}
