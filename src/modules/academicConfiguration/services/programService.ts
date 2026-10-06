// src/modules/academicConfiguration/services/programService.js
import { MOCK_PROGRAMS } from '../data/programMockData'
import { MOCK_COURSES } from '../data/courseMockData'
import { MOCK_CLASSES } from '../data/classMockData'

let programs = [...MOCK_PROGRAMS]
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const programService = {
  getPrograms: async () => {
    await delay()
    return [...programs]
  },

  getProgramById: async (id) => {
    await delay()
    return programs.find((p) => p.id === id) || null
  },

  createProgram: async (data) => {
    await delay(250)
    const newRecord = {
      id: `prog-${Date.now()}`,
      institutionId: 'inst-001',
      campusId: 'camp-001',
      coursesCount: 0,
      classesCount: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    programs = [newRecord, ...programs]
    return newRecord
  },

  updateProgram: async (id, data) => {
    await delay(250)
    programs = programs.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString().split('T')[0] } : p
    )
    return programs.find((p) => p.id === id)
  },

  updateProgramStatus: async (id, status) => {
    await delay(200)
    programs = programs.map((p) =>
      p.id === id ? { ...p, status, updatedAt: new Date().toISOString().split('T')[0] } : p
    )
    return programs.find((p) => p.id === id)
  },

  deleteProgram: async (id) => {
    await delay(250)
    const prog = programs.find((p) => p.id === id)
    if (!prog) throw new Error('Program not found')
    if (prog.classesCount > 0) {
      throw new Error(`Cannot delete: Program has ${prog.classesCount} active cohorts/classes assigned.`)
    }
    programs = programs.filter((p) => p.id !== id)
    return { success: true, id }
  },

  getProgramAssociatedEntities: async (id) => {
    await delay(150)
    const courses = MOCK_COURSES.filter((c) => c.programId === id)
    const classes = MOCK_CLASSES.filter((c) => c.programId === id)
    return { courses, classes }
  },
}
