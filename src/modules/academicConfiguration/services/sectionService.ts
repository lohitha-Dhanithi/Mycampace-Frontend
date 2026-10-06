// src/modules/academicConfiguration/services/sectionService.js
import { MOCK_SECTIONS } from '../data/sectionMockData'

let sections = [...MOCK_SECTIONS]
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const sectionService = {
  getSections: async (filters: any = {}) => {
    await delay()
    let result = [...sections]
    if (filters.classId) {
      result = result.filter((s) => s.classId === filters.classId)
    }
    if (filters.academicYearId) {
      result = result.filter((s) => s.academicYearId === filters.academicYearId)
    }
    return result
  },

  getSectionById: async (id) => {
    await delay()
    return sections.find((s) => s.id === id) || null
  },

  createSection: async (data) => {
    await delay(250)
    const newRecord = {
      id: `sec-${Date.now()}`,
      institutionId: 'inst-001',
      campusId: 'camp-001',
      currentStudents: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    sections = [newRecord, ...sections]
    return newRecord
  },

  updateSection: async (id, data) => {
    await delay(250)
    sections = sections.map((s) =>
      s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString().split('T')[0] } : s
    )
    return sections.find((s) => s.id === id)
  },

  deleteSection: async (id) => {
    await delay(250)
    const sec = sections.find((s) => s.id === id)
    if (!sec) throw new Error('Section not found')
    if (sec.currentStudents > 0) {
      throw new Error(`Cannot delete: Section has ${sec.currentStudents} enrolled students. Transfer students before deletion.`)
    }
    sections = sections.filter((s) => s.id !== id)
    return { success: true, id }
  },

  updateSectionStatus: async (id, status) => {
    await delay(200)
    sections = sections.map((s) =>
      s.id === id ? { ...s, status, updatedAt: new Date().toISOString().split('T')[0] } : s
    )
    return sections.find((s) => s.id === id)
  },
}
