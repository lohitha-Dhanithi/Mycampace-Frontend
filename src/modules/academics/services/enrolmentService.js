// src/modules/academics/services/enrolmentService.js
import { INITIAL_STUDENT_ENROLMENTS } from '../data/enrolmentMockData'
import { studentService } from '@/modules/students/services/studentService'

let enrolments = [...INITIAL_STUDENT_ENROLMENTS]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const enrolmentService = {
  getStudentEnrolments: async (filters = {}) => {
    await delay(120)
    let result = [...enrolments]

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter((e) => e.campusId === filters.campusId)
    }
    if (filters.academicYearId && filters.academicYearId !== 'all') {
      result = result.filter((e) => e.academicYearId === filters.academicYearId)
    }
    if (filters.programId && filters.programId !== 'all') {
      result = result.filter((e) => e.programId === filters.programId)
    }
    if (filters.classId && filters.classId !== 'all') {
      result = result.filter((e) => e.classId === filters.classId)
    }
    if (filters.sectionId && filters.sectionId !== 'all') {
      result = result.filter((e) => e.sectionId === filters.sectionId)
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((e) => e.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (e) =>
          e.studentName?.toLowerCase().includes(q) ||
          e.studentNumber?.toLowerCase().includes(q) ||
          e.admissionNumber?.toLowerCase().includes(q) ||
          e.className?.toLowerCase().includes(q)
      )
    }

    return result
  },

  changeStudentSection: async (studentId, { targetSectionId, targetSectionName, reason, effectiveDate }) => {
    await delay(200)
    const enr = enrolments.find((e) => e.studentId === studentId || e.id === studentId)
    if (!enr) throw new Error('Student enrolment record not found')

    const previousSection = enr.sectionName
    enr.sectionId = targetSectionId
    enr.sectionName = targetSectionName
    enr.remarks = `Reallocated from ${previousSection}: ${reason || 'Administrative rebalance'}`
    enr.effectiveFrom = effectiveDate || new Date().toISOString().split('T')[0]

    // Also update student master in SIS if present
    try {
      const s = await studentService.getStudentById(enr.studentId)
      if (s) {
        await studentService.updateStudent(s.id, {
          sectionId: targetSectionId,
          sectionName: targetSectionName,
        })
      }
    } catch (err) {
      console.warn('Could not sync section change with SIS master', err)
    }

    return enr
  },
}
