// src/modules/admissions/services/applicationService.js
import { INITIAL_APPLICATIONS } from '../data/applicationMockData'
import { APPLICATION_WORKFLOW_TRANSITIONS } from '../config/admissionStatusConfig'
import { documentService } from './documentService'

let applications: any[] = [...INITIAL_APPLICATIONS]
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

/**
 * Course-dependent fee structure mapping
 * Returns configured fee structure depending on the specific course opted for
 */
export function getCourseFeeStructure(courseNameOrId?: string, programName?: string) {
  const c = (courseNameOrId || '').toLowerCase()
  const p = (programName || '').toLowerCase()

  if (c.includes('science') || c.includes('pcm') || c.includes('pcb') || c.includes('b.tech') || c.includes('engineering') || p.includes('engineering')) {
    return {
      feeStructureId: 'fs-sci-composite-2026',
      feeStructureName: 'Senior Secondary Science Composite Fee (2026-27)',
      courseCategory: 'Science Stream (PCM / PCB)',
      totalFees: 120000,
      admissionFee: 25000,
      tuitionFee: 75000,
      labFee: 15000,
      developmentFee: 5000,
      netPayable: 120000,
      termSchedule: [
        { term: 'Term 1 (Admission & Induction)', amount: 65000, dueDate: '2026-11-15' },
        { term: 'Term 2 (Mid-Year Academic)', amount: 55000, dueDate: '2027-01-15' },
      ],
      description: 'Comprehensive fee structure for Senior Secondary Science (PCM/PCB) including Physics, Chemistry & Computer Labs.',
    }
  }

  if (c.includes('commerce') || c.includes('accountancy') || c.includes('business')) {
    return {
      feeStructureId: 'fs-com-composite-2026',
      feeStructureName: 'Senior Secondary Commerce Composite Fee (2026-27)',
      courseCategory: 'Commerce with Applied Mathematics',
      totalFees: 95000,
      admissionFee: 20000,
      tuitionFee: 65000,
      labFee: 5000,
      developmentFee: 5000,
      netPayable: 95000,
      termSchedule: [
        { term: 'Term 1 (Admission & Induction)', amount: 50000, dueDate: '2026-11-15' },
        { term: 'Term 2 (Mid-Year Academic)', amount: 45000, dueDate: '2027-01-15' },
      ],
      description: 'Fee structure for Senior Secondary Commerce with Applied Mathematics & Business Studies.',
    }
  }

  if (c.includes('humanities') || c.includes('arts') || c.includes('social') || c.includes('media')) {
    return {
      feeStructureId: 'fs-hum-composite-2026',
      feeStructureName: 'Senior Secondary Humanities & Media Studies Fee (2026-27)',
      courseCategory: 'Humanities & Social Sciences',
      totalFees: 85000,
      admissionFee: 15000,
      tuitionFee: 60000,
      labFee: 5000,
      developmentFee: 5000,
      netPayable: 85000,
      termSchedule: [
        { term: 'Term 1 (Admission & Induction)', amount: 45000, dueDate: '2026-11-15' },
        { term: 'Term 2 (Mid-Year Academic)', amount: 40000, dueDate: '2027-01-15' },
      ],
      description: 'Fee structure for Senior Secondary Humanities, Psychology and Media Studies.',
    }
  }

  // Default / Secondary School (Class 9-10)
  return {
    feeStructureId: 'fs-sec-composite-2026',
    feeStructureName: 'Secondary School Composite Annual Fee (2026-27)',
    courseCategory: 'Secondary School Curriculum',
    totalFees: 75000,
    admissionFee: 15000,
    tuitionFee: 50000,
    labFee: 5000,
    developmentFee: 5000,
    netPayable: 75000,
    termSchedule: [
      { term: 'Term 1 (Admission & Induction)', amount: 40000, dueDate: '2026-11-15' },
      { term: 'Term 2 (Mid-Year Academic)', amount: 35000, dueDate: '2027-01-15' },
    ],
    description: 'Annual fee structure for CBSE General Secondary Academic Curriculum.',
  }
}

export const applicationService = {
  getApplications: async (filters: any = {}) => {
    await delay(120)
    let result = [...applications]

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter(
        (a) =>
          !a.academicInterest?.campusId ||
          a.academicInterest?.campusId === filters.campusId ||
          ((filters.campusId === 'camp-1' || filters.campusId === 'campus-main') &&
            (a.academicInterest?.campusId === 'camp-1' || a.academicInterest?.campusId === 'campus-main'))
      )
    }

    if (filters.academicYearId && filters.academicYearId !== 'all') {
      result = result.filter(
        (a) =>
          !a.academicInterest?.academicYearId ||
          a.academicInterest?.academicYearId === filters.academicYearId ||
          ((filters.academicYearId === 'ay-2026' || filters.academicYearId === 'ay-2026-27') &&
            (a.academicInterest?.academicYearId === 'ay-2026' || a.academicInterest?.academicYearId === 'ay-2026-27'))
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

    if (filters.feeStatus && filters.feeStatus !== 'all') {
      result = result.filter(
        (a) => a.feeDetails?.feeStatus?.toLowerCase() === filters.feeStatus.toLowerCase()
      )
    }

    if (filters.documentStatus && filters.documentStatus !== 'all') {
      result = result.filter(
        (a) => a.documentVerificationSummary?.status?.toLowerCase() === filters.documentStatus.toLowerCase()
      )
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
      feeDetails: data.feeDetails || {
        feeStructureId: 'fs-btech-cse-y1',
        feeStructureName: 'General University Fee Schedule (2026-27)',
        totalFees: 120000,
        admissionFee: 25000,
        tuitionFee: 95000,
        discountAmount: 0,
        netPayable: 120000,
        paidAmount: 0,
        outstandingAmount: 120000,
        feeStatus: 'Not Invoiced',
        dueDate: '2026-11-15',
        lastPaymentDate: null,
        invoiceNumber: null,
        receiptNumber: null,
        paymentMode: null,
        transactionRef: null,
      },
      documentVerificationSummary: data.documentVerificationSummary || {
        totalRequired: 4,
        verifiedCount: 0,
        pendingCount: 4,
        rejectedCount: 0,
        status: 'Pending Verification',
        lastUpdated: new Date().toISOString().split('T')[0],
        verifiedBy: null,
      },
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

  sendAdmissionPolicyToParent: async (id: string, policyData: any = {}) => {
    await delay(200)
    const app = applications.find((a) => a.id === id)
    if (!app) throw new Error('Application not found')

    const parentEmail = policyData.parentEmail || app.guardian?.email || app.contact?.email || 'parent@example.com'
    const parentName = policyData.parentName || app.guardian?.name || 'Parent / Guardian'
    const parentMobile = policyData.parentMobile || app.guardian?.mobile || app.contact?.mobile || ''

    // Calculate course fee for this applicant
    const courseFee = getCourseFeeStructure(
      app.academicInterest?.courseName || app.academicInterest?.courseId,
      app.academicInterest?.programName
    )

    app.status = 'Policy Shared'
    app.admissionPolicy = {
      policyStatus: 'Policy Sent',
      policyDocumentName: `Institutional Admission Policy & Terms (2026-27)`,
      policySentDate: new Date().toISOString().split('T')[0],
      policySentToEmail: parentEmail,
      parentName,
      parentMobile,
      termsAccepted: false,
      termsAcceptedDate: null,
      termsAcceptedBy: null,
      parentDeclarationNotes: null,
      offeredCourse: app.academicInterest?.courseName || 'Standard Curriculum',
      applicableFeeSchedule: courseFee.feeStructureName,
      applicableTotalFee: courseFee.totalFees,
    }

    app.communications = [
      {
        id: `comm-${Date.now()}`,
        type: 'Email',
        recipient: parentEmail,
        sentBy: 'Registrar & Admissions Board',
        date: new Date().toLocaleString(),
        status: 'Delivered',
        subject: `Institutional Admission Policy Document & Verification Checklist for ${app.applicantName} (${app.applicationNumber})`,
      },
      ...(app.communications || []),
    ]

    return { ...app }
  },

  parentSubmitPolicyAndDocuments: async (id: string, submissionData: any = {}) => {
    await delay(250)
    const app = applications.find((a) => a.id === id)
    if (!app) throw new Error('Application not found')

    const parentName = submissionData.parentName || app.admissionPolicy?.parentName || app.guardian?.name || 'Parent / Guardian'
    const parentSignature = submissionData.parentSignature || parentName
    const notes = submissionData.parentNotes || 'All required credentials uploaded and institutional terms accepted.'

    app.status = 'Docs Uploaded'
    app.admissionPolicy = {
      ...(app.admissionPolicy || {}),
      policyStatus: 'Docs Uploaded',
      termsAccepted: true,
      termsAcceptedDate: new Date().toISOString().split('T')[0],
      termsAcceptedBy: parentName,
      parentSignature,
      parentDeclarationNotes: notes,
      digitalSignatureHash: `SIG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    }

    // If documents were uploaded in this parent submission, upload them to documentService
    if (submissionData.uploadedDocs && Array.isArray(submissionData.uploadedDocs)) {
      for (const d of submissionData.uploadedDocs) {
        await documentService.uploadDocument(id, {
          id: d.id,
          type: d.type,
          code: d.code || 'DOC',
          fileName: d.fileName || `${d.type.replace(/\s+/g, '_')}_Parent_Upload.pdf`,
          fileSize: d.fileSize || '1.8 MB',
        })
      }
    }

    // Refresh application document summary
    const docs = await documentService.getApplicationDocuments(id)
    const verified = docs.filter((d) => d.verificationStatus === 'Verified').length
    const total = docs.length || 4

    app.documentVerificationSummary = {
      totalRequired: total,
      verifiedCount: verified,
      pendingCount: total - verified,
      rejectedCount: 0,
      status: verified === total && total > 0 ? 'Verified' : 'Pending Verification',
      lastUpdated: new Date().toISOString().split('T')[0],
      verifiedBy: app.documentVerificationSummary?.verifiedBy || null,
    }

    app.communications = [
      {
        id: `comm-${Date.now()}`,
        type: 'Notification',
        recipient: app.admissionPolicy?.policySentToEmail || app.contact?.email || 'Admissions',
        sentBy: 'Parent Admission Portal',
        date: new Date().toLocaleString(),
        status: 'Delivered',
        subject: `Parent Sign-Off: Terms Accepted & ${total} Documents Uploaded for ${app.applicantName}`,
      },
      ...(app.communications || []),
    ]

    return { ...app }
  },

  approveAllDocumentsAndSendToFinance: async (id: string, reviewerNotes?: string) => {
    await delay(250)
    const app = applications.find((a) => a.id === id)
    if (!app) throw new Error('Application not found')

    // Mark all documents as verified in documentService
    const docs = await documentService.getApplicationDocuments(id)
    for (const d of docs) {
      if (d.verificationStatus !== 'Verified') {
        await documentService.verifyDocument(d.id, 'Admissions Review Committee')
      }
    }

    const total = docs.length || 4
    app.documentVerificationSummary = {
      totalRequired: total,
      verifiedCount: total,
      pendingCount: 0,
      rejectedCount: 0,
      status: 'Verified',
      lastUpdated: new Date().toISOString().split('T')[0],
      verifiedBy: 'Admissions Review Committee',
    }

    // Set admission policy as Approved
    app.admissionPolicy = {
      ...(app.admissionPolicy || {}),
      policyStatus: 'Approved',
      termsAccepted: true,
      termsAcceptedDate: app.admissionPolicy?.termsAcceptedDate || new Date().toISOString().split('T')[0],
      termsAcceptedBy: app.admissionPolicy?.termsAcceptedBy || app.guardian?.name || 'Parent / Guardian',
    }

    // Determine course-dependent fee structure!
    const courseFee = getCourseFeeStructure(
      app.academicInterest?.courseName || app.academicInterest?.courseId,
      app.academicInterest?.programName
    )

    const invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
    const admissionNumber = app.admissionDetails?.admissionNumber || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`
    const rollNumber = app.admissionDetails?.rollNumber || `ROLL-${Math.floor(10 + Math.random() * 90)}`

    app.status = 'Admitted'
    app.sentToFinance = true
    app.feeDetails = {
      feeStructureId: courseFee.feeStructureId,
      feeStructureName: courseFee.feeStructureName,
      totalFees: courseFee.totalFees,
      admissionFee: courseFee.admissionFee,
      tuitionFee: courseFee.tuitionFee,
      discountAmount: 0,
      netPayable: courseFee.netPayable,
      paidAmount: 0,
      outstandingAmount: courseFee.netPayable,
      feeStatus: 'Pending',
      dueDate: '2026-11-15',
      lastPaymentDate: null,
      invoiceNumber,
      receiptNumber: null,
      paymentMode: null,
      transactionRef: null,
      termSchedule: courseFee.termSchedule,
    }

    app.admissionDetails = {
      admissionNumber,
      rollNumber,
      allocatedSection: app.admissionDetails?.allocatedSection || 'Section A',
      admissionDate: new Date().toISOString().split('T')[0],
      admissionNotes:
        reviewerNotes ||
        `All verification documents approved by Admissions. Handed over to Finance under ${courseFee.feeStructureName}.`,
    }

    app.communications = [
      {
        id: `comm-${Date.now()}`,
        type: 'Email',
        recipient: app.contact?.email || 'Applicant',
        sentBy: 'Registrar & Admissions',
        date: new Date().toLocaleString(),
        status: 'Delivered',
        subject: `Admission Confirmed (${admissionNumber}) - Invoiced for ${courseFee.feeStructureName} (Invoice #${invoiceNumber})`,
      },
      ...(app.communications || []),
    ]

    return { ...app }
  },

  convertToAdmission: async (id, admissionData: any = {}) => {
    await delay(250)
    const app = applications.find((a) => a.id === id)
    if (!app) throw new Error('Application not found')

    // Determine course-dependent fee structure
    const courseFee = getCourseFeeStructure(
      app.academicInterest?.courseName || app.academicInterest?.courseId,
      app.academicInterest?.programName
    )

    app.status = 'Admitted'
    app.sentToFinance = true
    if (!app.feeDetails) {
      app.feeDetails = {
        feeStructureId: courseFee.feeStructureId,
        feeStructureName: courseFee.feeStructureName,
        totalFees: courseFee.totalFees,
        admissionFee: courseFee.admissionFee,
        tuitionFee: courseFee.tuitionFee,
        discountAmount: 0,
        netPayable: courseFee.netPayable,
        paidAmount: 0,
        outstandingAmount: courseFee.netPayable,
        feeStatus: 'Pending',
        dueDate: '2026-11-15',
        lastPaymentDate: null,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        receiptNumber: null,
        paymentMode: null,
        transactionRef: null,
        termSchedule: courseFee.termSchedule,
      }
    }
    if (!app.feeDetails.invoiceNumber) {
      app.feeDetails.invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
    }
    app.admissionDetails = {
      admissionNumber: admissionData.admissionNumber || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      rollNumber: admissionData.rollNumber || `ROLL-${Math.floor(10 + Math.random() * 90)}`,
      allocatedSection: admissionData.section || 'Section A',
      admissionDate: admissionData.admissionDate || new Date().toISOString().split('T')[0],
      admissionNotes: admissionData.admissionNotes || `Admission officially confirmed by Admissions Committee under ${courseFee.feeStructureName}.`,
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

  sendToFinance: async (id: string) => {
    await delay(180)
    const app = applications.find((a) => a.id === id)
    if (!app) throw new Error('Application not found')

    const courseFee = getCourseFeeStructure(
      app.academicInterest?.courseName || app.academicInterest?.courseId,
      app.academicInterest?.programName
    )

    app.sentToFinance = true
    if (!app.feeDetails) {
      app.feeDetails = {
        feeStructureId: courseFee.feeStructureId,
        feeStructureName: courseFee.feeStructureName,
        totalFees: courseFee.totalFees,
        admissionFee: courseFee.admissionFee,
        tuitionFee: courseFee.tuitionFee,
        discountAmount: 0,
        netPayable: courseFee.netPayable,
        paidAmount: 0,
        outstandingAmount: courseFee.netPayable,
        feeStatus: 'Pending',
        dueDate: '2026-11-15',
        lastPaymentDate: null,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        receiptNumber: null,
        paymentMode: null,
        transactionRef: null,
        termSchedule: courseFee.termSchedule,
      }
    }
    if (!app.feeDetails.invoiceNumber) {
      app.feeDetails.invoiceNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
    }

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

  recordFeePayment: async (applicationId, { amount, paymentMode, transactionRef, notes }) => {
    await delay(200)
    const app = applications.find((a) => a.id === applicationId)
    if (!app) throw new Error('Application not found')

    const currentFee = app.feeDetails || {
      feeStructureId: 'fs-std',
      feeStructureName: 'General Admission Fee Schedule',
      totalFees: 120000,
      admissionFee: 25000,
      tuitionFee: 95000,
      discountAmount: 0,
      netPayable: 120000,
      paidAmount: 0,
      outstandingAmount: 120000,
      feeStatus: 'Pending',
    }

    const payAmount = Number(amount) || 0
    const newPaid = (currentFee.paidAmount || 0) + payAmount
    const net = currentFee.netPayable || currentFee.totalFees || 120000
    const newOutstanding = Math.max(0, net - newPaid)
    const newStatus = newOutstanding === 0 ? 'Paid' : newPaid > 0 ? 'Partially Paid' : 'Pending'
    const receiptNumber = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`

    app.feeDetails = {
      ...currentFee,
      paidAmount: newPaid,
      outstandingAmount: newOutstanding,
      feeStatus: newStatus,
      lastPaymentDate: new Date().toISOString().split('T')[0],
      receiptNumber,
      paymentMode: paymentMode || 'UPI / Net Banking',
      transactionRef: transactionRef || `PAY-TXN-${Date.now().toString().slice(-6)}`,
    }

    // Auto-advance application status if approved and admission fee paid
    if (app.status === 'Approved' && newPaid >= (currentFee.admissionFee || 20000)) {
      app.status = 'Admitted'
      if (!app.admissionDetails) {
        app.admissionDetails = {
          admissionNumber: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
          rollNumber: `26-${(app.personal?.firstName || 'STU').slice(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
          allocatedSection: 'Section A',
          admissionDate: new Date().toISOString().split('T')[0],
          admissionNotes: 'Direct admission auto-confirmed upon admission fee clearance.',
        }
      }
    }

    app.communications = [
      {
        id: `comm-${Date.now()}`,
        type: 'Receipt',
        recipient: app.contact?.email || 'Applicant',
        sentBy: 'Finance & Accounts',
        date: new Date().toLocaleString(),
        status: 'Delivered',
        subject: `Fee Payment Acknowledgment: ₹${payAmount.toLocaleString('en-IN')} Received (${receiptNumber})`,
      },
      ...(app.communications || []),
    ]

    return { ...app }
  },

  updateDocumentVerification: async (applicationId, docSummary) => {
    await delay(100)
    const app = applications.find((a) => a.id === applicationId)
    if (!app) return null

    app.documentVerificationSummary = {
      ...(app.documentVerificationSummary || {}),
      ...docSummary,
      lastUpdated: new Date().toISOString().split('T')[0],
    }

    // If documents are required or rejected, update application status if not already admitted
    if (docSummary.rejectedCount > 0 && ['Submitted', 'Under Review'].includes(app.status)) {
      app.status = 'Documents Required'
    }

    return { ...app }
  },
}
