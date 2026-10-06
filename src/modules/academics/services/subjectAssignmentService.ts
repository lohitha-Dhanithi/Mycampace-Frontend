// src/modules/academics/services/subjectAssignmentService.js
import { INITIAL_SUBJECT_ASSIGNMENTS } from '../data/subjectAssignmentMockData'

let subjectAssignments = [...INITIAL_SUBJECT_ASSIGNMENTS]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const subjectAssignmentService = {
  getSubjectAssignments: async (filters: any = {}) => {
    await delay(100)
    let result = [...subjectAssignments]

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
          s.subjectName?.toLowerCase().includes(q) ||
          s.facultyName?.toLowerCase().includes(q) ||
          s.className?.toLowerCase().includes(q)
      )
    }

    return result
  },

  createSubjectAssignment: async (data) => {
    await delay(180)
    const newAss = {
      id: `sa-${Date.now()}`,
      status: data.facultyId ? 'Assigned' : 'Unassigned',
      ...data,
    }
    subjectAssignments = [newAss, ...subjectAssignments]
    return newAss
  },

  updateSubjectAssignment: async (id, data) => {
    await delay(150)
    subjectAssignments = subjectAssignments.map((s) => (s.id === id ? { ...s, ...data } : s))
    return subjectAssignments.find((s) => s.id === id)
  },

  removeSubjectAssignment: async (id) => {
    await delay(150)
    subjectAssignments = subjectAssignments.filter((s) => s.id !== id)
    return true
  },
}
