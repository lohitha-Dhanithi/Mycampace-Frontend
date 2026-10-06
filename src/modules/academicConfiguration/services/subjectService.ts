// src/modules/academicConfiguration/services/subjectService.js
import { MOCK_SUBJECTS } from '../data/subjectMockData'

let subjects = [...MOCK_SUBJECTS]
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const subjectService = {
  getSubjects: async (filters: any = {}) => {
    await delay()
    let result = [...subjects]
    if (filters.departmentId) {
      result = result.filter((s) => s.departmentId === filters.departmentId)
    }
    if (filters.courseId) {
      result = result.filter((s) => s.courseId === filters.courseId)
    }
    if (filters.type) {
      result = result.filter((s) => s.type === filters.type)
    }
    return result
  },

  getSubjectById: async (id) => {
    await delay()
    return subjects.find((s) => s.id === id) || null
  },

  createSubject: async (data) => {
    await delay(250)
    const newRecord = {
      id: `sub-${Date.now()}`,
      institutionId: 'inst-001',
      campusId: 'camp-001',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    subjects = [newRecord, ...subjects]
    return newRecord
  },

  updateSubject: async (id, data) => {
    await delay(250)
    subjects = subjects.map((s) =>
      s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString().split('T')[0] } : s
    )
    return subjects.find((s) => s.id === id)
  },

  deleteSubject: async (id) => {
    await delay(250)
    subjects = subjects.filter((s) => s.id !== id)
    return { success: true, id }
  },

  updateSubjectStatus: async (id, status) => {
    await delay(200)
    subjects = subjects.map((s) =>
      s.id === id ? { ...s, status, updatedAt: new Date().toISOString().split('T')[0] } : s
    )
    return subjects.find((s) => s.id === id)
  },
}
