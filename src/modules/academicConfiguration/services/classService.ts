// src/modules/academicConfiguration/services/classService.js
import { MOCK_CLASSES } from '../data/classMockData'
import { MOCK_SECTIONS } from '../data/sectionMockData'

let classes = [...MOCK_CLASSES]
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const classService = {
  getClasses: async (filters: any = {}) => {
    await delay()
    let result = [...classes]
    if (filters.academicYearId) {
      result = result.filter((c) => c.academicYearId === filters.academicYearId)
    }
    if (filters.programId) {
      result = result.filter((c) => c.programId === filters.programId)
    }
    return result
  },

  getClassById: async (id) => {
    await delay()
    return classes.find((c) => c.id === id) || null
  },

  createClass: async (data) => {
    await delay(250)
    const newRecord = {
      id: `cls-${Date.now()}`,
      institutionId: 'inst-001',
      campusId: 'camp-001',
      sectionCount: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    classes = [newRecord, ...classes]
    return newRecord
  },

  updateClass: async (id, data) => {
    await delay(250)
    classes = classes.map((c) =>
      c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString().split('T')[0] } : c
    )
    return classes.find((c) => c.id === id)
  },

  deleteClass: async (id) => {
    await delay(250)
    const linkedSections = MOCK_SECTIONS.filter((s) => s.classId === id)
    if (linkedSections.length > 0) {
      throw new Error(`Cannot delete class: ${linkedSections.length} active sections are mapped to this class.`)
    }
    classes = classes.filter((c) => c.id !== id)
    return { success: true, id }
  },

  updateClassStatus: async (id, status) => {
    await delay(200)
    classes = classes.map((c) =>
      c.id === id ? { ...c, status, updatedAt: new Date().toISOString().split('T')[0] } : c
    )
    return classes.find((c) => c.id === id)
  },
}
