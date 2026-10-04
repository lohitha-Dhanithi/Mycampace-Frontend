// src/modules/students/services/studentService.js
import { INITIAL_STUDENTS } from '../data/studentMockData'
import { INITIAL_STUDENT_ACADEMIC_RECORDS } from '../data/studentAcademicMockData'
import { INITIAL_GUARDIANS } from '../data/guardianMockData'
import { INITIAL_STUDENT_DOCUMENTS } from '../data/studentDocumentMockData'
import {
  INITIAL_STUDENT_TRANSFERS,
  INITIAL_STUDENT_EXITS,
  INITIAL_STUDENT_ACTIVITIES,
} from '../data/studentLifecycleMockData'
import { VALID_STATUS_TRANSITIONS } from '../config/studentStatusConfig'

let students = [...INITIAL_STUDENTS]
let academicRecords = [...INITIAL_STUDENT_ACADEMIC_RECORDS]
let guardians = [...INITIAL_GUARDIANS]
let documents = [...INITIAL_STUDENT_DOCUMENTS]
let transfers = [...INITIAL_STUDENT_TRANSFERS]
let exits = [...INITIAL_STUDENT_EXITS]
let activities = [...INITIAL_STUDENT_ACTIVITIES]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const studentService = {
  getStudents: async (filters = {}) => {
    await delay(120)
    let result = [...students]

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter((s) => s.campusId === filters.campusId)
    }

    if (filters.academicYearId && filters.academicYearId !== 'all') {
      result = result.filter((s) => s.academicYearId === filters.academicYearId)
    }

    if (filters.programId && filters.programId !== 'all') {
      result = result.filter((s) => s.programId === filters.programId)
    }

    if (filters.classId && filters.classId !== 'all') {
      result = result.filter((s) => s.classId === filters.classId)
    }

    if (filters.sectionId && filters.sectionId !== 'all') {
      result = result.filter((s) => s.sectionId === filters.sectionId)
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((s) => s.status.toLowerCase() === filters.status.toLowerCase())
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (s) =>
          s.personal?.fullName?.toLowerCase().includes(q) ||
          s.studentId?.toLowerCase().includes(q) ||
          s.admissionNumber?.toLowerCase().includes(q) ||
          s.contact?.primaryMobile?.includes(q) ||
          s.contact?.email?.toLowerCase().includes(q) ||
          s.className?.toLowerCase().includes(q)
      )
    }

    return result
  },

  getStudentById: async (id) => {
    await delay(100)
    return students.find((s) => s.id === id || s.studentId === id) || null
  },

  createStudent: async (studentData) => {
    await delay(200)
    const newCount = students.length + 1
    const deterministicId = `STU-${String(newCount).padStart(3, '0')}`
    const admissionNumber = studentData.admissionNumber || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`

    // Prevent duplicate IDs
    if (students.some((s) => s.studentId === deterministicId || s.admissionNumber === admissionNumber)) {
      throw new Error('A student with this Student ID or Admission Number already exists.')
    }

    const fullName = `${studentData.personal?.firstName || ''} ${studentData.personal?.lastName || ''}`.trim() || 'Student'
    const newStudent = {
      id: `stu-${Date.now()}`,
      studentId: deterministicId,
      admissionNumber,
      applicationId: studentData.applicationId || null,
      leadId: studentData.leadId || null,
      enquiryId: studentData.enquiryId || null,
      institutionId: studentData.institutionId || 'inst-1',
      campusId: studentData.campusId || 'camp-1',
      campusName: studentData.campusName || 'Hyderabad Main Campus',
      academicYearId: studentData.academicYearId || 'ay-2026-27',
      academicYearName: studentData.academicYearName || '2026-2027',
      programId: studentData.programId || 'prog-1',
      programName: studentData.programName || 'Senior Secondary Education',
      courseId: studentData.courseId || 'crs-1',
      courseName: studentData.courseName || 'Science Stream (PCM / PCB)',
      classId: studentData.classId || 'cls-11',
      className: studentData.className || 'Class 11',
      sectionId: studentData.sectionId || 'sec-11A',
      sectionName: studentData.sectionName || 'Section A',
      rollNumber: studentData.rollNumber || `${studentData.className || '11'}-A-${String(newCount).padStart(2, '0')}`,
      admissionDate: studentData.admissionDate || new Date().toISOString().split('T')[0],
      status: studentData.status || 'Active',
      avatar: studentData.avatar || '',
      personal: {
        ...studentData.personal,
        fullName,
      },
      contact: studentData.contact || {},
      address: studentData.address || {},
      attendanceSummary: {
        attendancePercentage: 100,
        presentDays: 1,
        absentDays: 0,
        lateDays: 0,
        totalWorkingDays: 1,
      },
      examinationSummary: {
        latestExam: 'Enrolment Baseline',
        overallPercentage: '—',
        overallGrade: 'In Progress',
        result: 'Active Student',
      },
      feeSummary: {
        totalFees: 150000,
        paidAmount: 50000,
        pendingAmount: 100000,
        overdueAmount: 0,
        status: 'Partially Paid',
      },
      pendingDocumentsCount: 0,
    }

    students = [newStudent, ...students]

    // Create corresponding Current Academic Record
    const newAcademicRecord = {
      id: `sar-${Date.now()}`,
      studentId: newStudent.id,
      academicYearId: newStudent.academicYearId,
      academicYearName: newStudent.academicYearName,
      campusId: newStudent.campusId,
      campusName: newStudent.campusName,
      programId: newStudent.programId,
      programName: newStudent.programName,
      courseId: newStudent.courseId,
      courseName: newStudent.courseName,
      classId: newStudent.classId,
      className: newStudent.className,
      sectionId: newStudent.sectionId,
      sectionName: newStudent.sectionName,
      rollNumber: newStudent.rollNumber,
      classTeacher: 'Pooja Iyer',
      status: 'Current',
      enrolmentDate: newStudent.admissionDate,
      remarks: 'Primary admission enrolment',
    }
    academicRecords = [newAcademicRecord, ...academicRecords]

    // Add Guardian if provided
    if (studentData.guardian?.name) {
      const newGuardian = {
        id: `grd-${Date.now()}`,
        studentId: newStudent.id,
        name: studentData.guardian.name,
        relationship: studentData.guardian.relationship || 'Father',
        mobile: studentData.guardian.mobile || studentData.contact?.primaryMobile,
        email: studentData.guardian.email || studentData.contact?.email,
        occupation: studentData.guardian.occupation || '',
        address: studentData.address?.addressLine1 || '',
        isPrimary: true,
        isEmergencyContact: true,
        portalAccess: true,
        status: 'Active',
      }
      guardians = [newGuardian, ...guardians]
    }

    // Add activity log
    activities = [
      {
        id: `sact-${Date.now()}`,
        studentId: newStudent.id,
        activity: 'Student Master Created',
        user: 'Admissions Administrator',
        date: new Date().toLocaleString(),
        details: `Created student account with ID ${newStudent.studentId}.`,
      },
      ...activities,
    ]

    return newStudent
  },

  updateStudent: async (id, updatedData) => {
    await delay(180)
    students = students.map((s) => {
      if (s.id === id) {
        const merged = { ...s, ...updatedData }
        if (updatedData.personal?.firstName || updatedData.personal?.lastName) {
          merged.personal.fullName = `${updatedData.personal?.firstName || s.personal?.firstName} ${updatedData.personal?.lastName || s.personal?.lastName}`.trim()
        }
        return merged
      }
      return s
    })
    return students.find((s) => s.id === id)
  },

  updateStudentStatus: async (id, newStatus, reason = '') => {
    await delay(180)
    const st = students.find((s) => s.id === id)
    if (!st) throw new Error('Student not found')

    const allowed = VALID_STATUS_TRANSITIONS[st.status] || []
    if (allowed.length > 0 && !allowed.includes(newStatus)) {
      throw new Error(`Cannot transition student from "${st.status}" to "${newStatus}"`)
    }

    st.status = newStatus

    activities = [
      {
        id: `sact-${Date.now()}`,
        studentId: id,
        activity: `Status Changed to ${newStatus}`,
        user: 'Academic Administrator',
        date: new Date().toLocaleString(),
        details: reason || `Updated lifecycle status to ${newStatus}.`,
      },
      ...activities,
    ]

    return { ...st }
  },

  searchStudents: async (query = '') => {
    await delay(100)
    if (!query) return [...students]
    const q = query.toLowerCase()
    return students.filter(
      (s) =>
        s.personal?.fullName?.toLowerCase().includes(q) ||
        s.studentId?.toLowerCase().includes(q) ||
        s.admissionNumber?.toLowerCase().includes(q) ||
        s.contact?.primaryMobile?.includes(q) ||
        s.contact?.email?.toLowerCase().includes(q)
    )
  },

  createStudentFromAdmission: async (application) => {
    if (!application) throw new Error('Valid admission application object is required.')
    
    // Check if student already created from this application
    const existing = students.find((s) => s.applicationId === application.id)
    if (existing) {
      throw new Error(`Student record (${existing.studentId}) already exists for this application.`)
    }

    const payload = {
      applicationId: application.id,
      leadId: application.leadId || null,
      enquiryId: application.enquiryId || null,
      institutionId: application.academicInterest?.institutionId || 'inst-1',
      campusId: application.academicInterest?.campusId || 'camp-1',
      campusName: application.academicInterest?.campusName || 'Hyderabad Main Campus',
      academicYearId: application.academicInterest?.academicYearId || 'ay-2026-27',
      academicYearName: application.academicInterest?.academicYearName || '2026-2027',
      programId: application.academicInterest?.programId || 'prog-1',
      programName: application.academicInterest?.programName || 'Senior Secondary Education',
      courseId: application.academicInterest?.courseId || 'crs-1',
      courseName: application.academicInterest?.courseName || 'Science Stream (PCM / PCB)',
      classId: application.academicInterest?.classId || 'cls-11',
      className: application.academicInterest?.className || 'Class 11',
      sectionId: application.admissionDetails?.sectionId || 'sec-11A',
      sectionName: application.admissionDetails?.allocatedSection || 'Section A (PCM)',
      rollNumber: application.admissionDetails?.allocatedRollNumber || `11-A-${Math.floor(10 + Math.random() * 90)}`,
      admissionNumber: application.admissionDetails?.admissionNumber || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      admissionDate: application.admissionDetails?.admissionDate || new Date().toISOString().split('T')[0],
      status: 'Active',
      avatar: application.avatar || '',
      personal: {
        firstName: application.personal?.firstName || application.applicantName?.split(' ')[0] || '',
        middleName: application.personal?.middleName || '',
        lastName: application.personal?.lastName || application.applicantName?.split(' ').slice(1).join(' ') || '',
        dob: application.personal?.dob || '2009-01-01',
        gender: application.personal?.gender || 'Male',
        nationality: application.personal?.nationality || 'Indian',
        bloodGroup: application.personal?.bloodGroup || 'B Positive',
        aadhaarNumber: application.personal?.aadhaarNumber || '',
      },
      contact: {
        primaryMobile: application.contact?.mobile || '',
        alternateMobile: application.contact?.alternatePhone || '',
        email: application.contact?.email || '',
        alternateEmail: '',
      },
      address: {
        addressLine1: application.contact?.address || '',
        city: application.contact?.city || 'Hyderabad',
        state: application.contact?.state || 'Telangana',
        country: application.contact?.country || 'India',
        postalCode: application.contact?.postalCode || '',
      },
      guardian: {
        name: application.guardian?.name || 'Primary Guardian',
        relationship: application.guardian?.relationship || 'Father',
        mobile: application.guardian?.mobile || application.contact?.mobile || '',
        email: application.guardian?.email || application.contact?.email || '',
        occupation: application.guardian?.occupation || '',
      },
    }

    return studentService.createStudent(payload)
  },

  // Academic Records
  getStudentAcademicRecords: async (studentId) => {
    await delay(100)
    return academicRecords.filter((r) => r.studentId === studentId)
  },

  createAcademicRecord: async (recordData) => {
    await delay(180)
    // When creating a new current record, mark existing current record as Completed
    if (recordData.status === 'Current') {
      academicRecords = academicRecords.map((r) =>
        r.studentId === recordData.studentId && r.status === 'Current'
          ? { ...r, status: 'Completed' }
          : r
      )
    }

    const newRecord = {
      id: `sar-${Date.now()}`,
      status: 'Current',
      enrolmentDate: new Date().toISOString().split('T')[0],
      ...recordData,
    }
    academicRecords = [newRecord, ...academicRecords]
    return newRecord
  },

  // Guardians
  getGuardians: async (studentId) => {
    await delay(100)
    return guardians.filter((g) => g.studentId === studentId)
  },

  createGuardian: async (data) => {
    await delay(180)
    // If set as primary, unmark existing primary
    if (data.isPrimary) {
      guardians = guardians.map((g) =>
        g.studentId === data.studentId ? { ...g, isPrimary: false } : g
      )
    }
    const newG = {
      id: `grd-${Date.now()}`,
      status: 'Active',
      ...data,
    }
    guardians = [newG, ...guardians]
    return newG
  },

  updateGuardian: async (id, updatedData) => {
    await delay(150)
    if (updatedData.isPrimary) {
      const current = guardians.find((g) => g.id === id)
      if (current) {
        guardians = guardians.map((g) =>
          g.studentId === current.studentId ? { ...g, isPrimary: false } : g
        )
      }
    }
    guardians = guardians.map((g) => (g.id === id ? { ...g, ...updatedData } : g))
    return guardians.find((g) => g.id === id)
  },

  setPrimaryGuardian: async (id) => {
    await delay(150)
    const target = guardians.find((g) => g.id === id)
    if (!target) throw new Error('Guardian not found')

    guardians = guardians.map((g) =>
      g.studentId === target.studentId
        ? { ...g, isPrimary: g.id === id }
        : g
    )
    return target
  },

  removeGuardian: async (id) => {
    await delay(150)
    const target = guardians.find((g) => g.id === id)
    if (!target) throw new Error('Guardian not found')

    // Rule: Cannot delete the only primary guardian
    const studentGuardians = guardians.filter((g) => g.studentId === target.studentId)
    if (target.isPrimary && studentGuardians.length === 1) {
      throw new Error('Cannot remove the primary guardian. A student must have at least one primary guardian.')
    }

    guardians = guardians.filter((g) => g.id !== id)
    return true
  },

  // Documents
  getStudentDocuments: async (studentId) => {
    await delay(100)
    return documents.filter((d) => d.studentId === studentId)
  },

  uploadStudentDocument: async (studentId, docData) => {
    await delay(200)
    const newDoc = {
      id: `sdoc-${Date.now()}`,
      studentId,
      documentName: docData.documentName || 'Document_Upload.pdf',
      documentType: docData.documentType || 'Identity Proof',
      documentCode: docData.documentCode || 'DOC',
      required: !!docData.required,
      status: 'Pending',
      uploadedDate: new Date().toISOString().split('T')[0],
      verifiedBy: null,
      verifiedDate: null,
      fileSize: '1.4 MB',
      remarks: docData.remarks || '',
    }
    documents = [newDoc, ...documents]
    return newDoc
  },

  verifyStudentDocument: async (id, reviewerName = 'Registrar') => {
    await delay(150)
    documents = documents.map((d) =>
      d.id === id
        ? {
            ...d,
            status: 'Verified',
            verifiedBy: reviewerName,
            verifiedDate: new Date().toISOString().split('T')[0],
          }
        : d
    )
    return documents.find((d) => d.id === id)
  },

  rejectStudentDocument: async (id, reason) => {
    await delay(150)
    documents = documents.map((d) =>
      d.id === id
        ? {
            ...d,
            status: 'Rejected',
            remarks: reason || 'Document rejected. Please upload fresh copy.',
          }
        : d
    )
    return documents.find((d) => d.id === id)
  },

  // Lifecycle: Transfers
  getTransfers: async () => {
    await delay(100)
    return [...transfers]
  },

  requestTransfer: async (data) => {
    await delay(180)
    const newTrf = {
      id: `trf-${Date.now()}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Requested',
      ...data,
    }
    transfers = [newTrf, ...transfers]
    return newTrf
  },

  completeTransfer: async (id) => {
    await delay(200)
    const trf = transfers.find((t) => t.id === id)
    if (!trf) throw new Error('Transfer request not found')

    trf.status = 'Completed'

    // Update student's current campus/class/section
    students = students.map((s) => {
      if (s.id === trf.studentId) {
        return {
          ...s,
          campusId: trf.destinationCampusId || s.campusId,
          campusName: trf.destinationCampus || s.campusName,
          className: trf.destinationClass || s.className,
          sectionName: trf.destinationSection || s.sectionName,
          status: 'Active',
        }
      }
      return s
    })

    return trf
  },

  approveTransfer: async (id) => {
    await delay(150)
    const trf = transfers.find((t) => t.id === id)
    if (!trf) throw new Error('Transfer request not found')
    trf.status = 'Approved'
    return trf
  },

  // Lifecycle: Promotion
  getPromotionCandidates: async (filters = {}) => {
    return studentService.getStudents({
      ...filters,
      status: 'Active',
    })
  },

  promoteStudents: async ({ studentIds, targetAcademicYear, targetClass, targetSection }) => {
    await delay(250)
    students = students.map((s) => {
      if (studentIds.includes(s.id)) {
        // Create new academic record
        const newRecord = {
          id: `sar-${Date.now()}-${s.id}`,
          studentId: s.id,
          academicYearId: targetAcademicYear.id,
          academicYearName: targetAcademicYear.name,
          campusId: s.campusId,
          campusName: s.campusName,
          programId: s.programId,
          programName: s.programName,
          courseId: s.courseId,
          courseName: s.courseName,
          classId: targetClass.id,
          className: targetClass.name,
          sectionId: targetSection.id,
          sectionName: targetSection.name,
          rollNumber: s.rollNumber,
          classTeacher: 'Assigned Class Teacher',
          status: 'Current',
          enrolmentDate: new Date().toISOString().split('T')[0],
          remarks: `Promoted from ${s.className}`,
        }

        // Mark previous record completed
        academicRecords = academicRecords.map((r) =>
          r.studentId === s.id && r.status === 'Current' ? { ...r, status: 'Completed' } : r
        )
        academicRecords.push(newRecord)

        return {
          ...s,
          academicYearId: targetAcademicYear.id,
          academicYearName: targetAcademicYear.name,
          classId: targetClass.id,
          className: targetClass.name,
          sectionId: targetSection.id,
          sectionName: targetSection.name,
        }
      }
      return s
    })

    return true
  },

  // Lifecycle: Exits
  getExits: async () => {
    await delay(100)
    return [...exits]
  },

  requestStudentExit: async (data) => {
    await delay(180)
    const newExit = {
      id: `exit-${Date.now()}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Requested',
      obligations: {
        feesCleared: false,
        libraryCleared: false,
        labEquipmentCleared: false,
        documentsReturned: false,
      },
      ...data,
    }
    exits = [newExit, ...exits]
    return newExit
  },

  approveStudentExit: async (id) => {
    await delay(150)
    const ex = exits.find((e) => e.id === id)
    if (!ex) throw new Error('Exit record not found')
    ex.status = 'Approved'
    return ex
  },

  completeStudentExit: async (id) => {
    await delay(200)
    const ex = exits.find((e) => e.id === id)
    if (!ex) throw new Error('Exit record not found')

    ex.status = 'Completed'
    students = students.map((s) => (s.id === ex.studentId ? { ...s, status: 'Exited' } : s))
    return ex
  },

  // Activity History
  getStudentActivities: async (studentId) => {
    await delay(100)
    return activities.filter((a) => a.studentId === studentId)
  },
}
