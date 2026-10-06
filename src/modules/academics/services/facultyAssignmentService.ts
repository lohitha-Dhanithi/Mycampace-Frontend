// src/modules/academics/services/facultyAssignmentService.js
import { INITIAL_FACULTY_ASSIGNMENTS } from '../data/facultyAssignmentMockData'

let assignments = [...INITIAL_FACULTY_ASSIGNMENTS]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const facultyAssignmentService = {
  getFacultyAssignments: async (filters: any = {}) => {
    await delay(100)
    let result = [...assignments]

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter((a) => a.campusId === filters.campusId)
    }
    if (filters.academicYearId && filters.academicYearId !== 'all') {
      result = result.filter((a) => a.academicYearId === filters.academicYearId)
    }
    if (filters.department && filters.department !== 'all') {
      result = result.filter((a) => a.department === filters.department)
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((a) => a.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (a) =>
          a.facultyName?.toLowerCase().includes(q) ||
          a.subjectName?.toLowerCase().includes(q) ||
          a.className?.toLowerCase().includes(q) ||
          a.department?.toLowerCase().includes(q)
      )
    }

    return result
  },

  getFacultyAssignmentById: async (id) => {
    await delay(80)
    return assignments.find((a) => a.id === id) || null
  },

  createFacultyAssignment: async (data) => {
    await delay(180)
    const newAssignment = {
      id: `fa-${Date.now()}`,
      assignedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      weeklyHours: 6,
      ...data,
    }
    assignments = [newAssignment, ...assignments]
    return newAssignment
  },

  updateFacultyAssignment: async (id, data) => {
    await delay(150)
    assignments = assignments.map((a) => (a.id === id ? { ...a, ...data } : a))
    return assignments.find((a) => a.id === id)
  },

  removeFacultyAssignment: async (id) => {
    await delay(150)
    assignments = assignments.map((a) => (a.id === id ? { ...a, status: 'Removed' } : a))
    return true
  },
}
