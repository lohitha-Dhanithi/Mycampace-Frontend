// src/modules/academics/services/classTeacherService.js
import { INITIAL_CLASS_TEACHERS } from '../data/classTeacherMockData'

let classTeachers = [...INITIAL_CLASS_TEACHERS]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const classTeacherService = {
  getClassTeachers: async (filters = {}) => {
    await delay(100)
    let result = [...classTeachers]

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter((c) => c.campusId === filters.campusId)
    }
    if (filters.academicYearId && filters.academicYearId !== 'all') {
      result = result.filter((c) => c.academicYearId === filters.academicYearId)
    }
    if (filters.classId && filters.classId !== 'all') {
      result = result.filter((c) => c.classId === filters.classId)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.facultyName?.toLowerCase().includes(q) ||
          c.className?.toLowerCase().includes(q) ||
          c.sectionName?.toLowerCase().includes(q)
      )
    }

    return result
  },

  assignClassTeacher: async (data) => {
    await delay(180)
    // Business rule: Only one active primary class teacher per section
    classTeachers = classTeachers.map((ct) => {
      if (ct.sectionId === data.sectionId && ct.status === 'Active') {
        return { ...ct, status: 'Relieved', notes: 'Relieved on reassignment' }
      }
      return ct
    })

    const newAssignment = {
      id: `ct-${Date.now()}`,
      status: 'Active',
      effectiveDate: new Date().toISOString().split('T')[0],
      studentCount: 40,
      ...data,
    }
    classTeachers = [newAssignment, ...classTeachers]
    return newAssignment
  },

  updateClassTeacher: async (id, data) => {
    await delay(150)
    classTeachers = classTeachers.map((c) => (c.id === id ? { ...c, ...data } : c))
    return classTeachers.find((c) => c.id === id)
  },
}
