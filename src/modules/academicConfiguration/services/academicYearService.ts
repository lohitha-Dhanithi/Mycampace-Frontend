// src/modules/academicConfiguration/services/academicYearService.js
import { MOCK_ACADEMIC_YEARS, MOCK_ACADEMIC_YEAR_ACTIVITY } from '../data/academicYearMockData'
import { MOCK_PROGRAMS } from '../data/programMockData'
import { MOCK_CLASSES } from '../data/classMockData'
import { MOCK_SECTIONS } from '../data/sectionMockData'

let academicYears = [...MOCK_ACADEMIC_YEARS]
let activityLogs = [...MOCK_ACADEMIC_YEAR_ACTIVITY]

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const academicYearService = {
  getAcademicYears: async () => {
    await delay()
    return [...academicYears]
  },

  getAcademicYearById: async (id) => {
    await delay()
    return academicYears.find((ay) => ay.id === id) || null
  },

  createAcademicYear: async (data) => {
    await delay(250)
    const newId = `ay-${Date.now()}`

    // If marked current, unmark others
    if (data.isCurrent) {
      academicYears = academicYears.map((ay) => ({ ...ay, isCurrent: false }))
    }

    const newRecord = {
      id: newId,
      institutionId: 'inst-001',
      campusId: 'camp-001',
      totalPrograms: 0,
      totalClasses: 0,
      totalSections: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    }

    academicYears = [newRecord, ...academicYears]

    // Log activity
    activityLogs.unshift({
      id: `act-ay-${Date.now()}`,
      academicYearId: newId,
      action: 'Academic Year Created',
      details: `Academic session ${data.name} (${data.code}) registered into the system.`,
      performedBy: 'Current Administrator',
      timestamp: new Date().toLocaleString(),
    })

    return newRecord
  },

  updateAcademicYear: async (id, data) => {
    await delay(250)
    if (data.isCurrent) {
      academicYears = academicYears.map((ay) =>
        ay.id === id ? { ...ay, ...data, isCurrent: true } : { ...ay, isCurrent: false }
      )
    } else {
      academicYears = academicYears.map((ay) =>
        ay.id === id ? { ...ay, ...data, updatedAt: new Date().toISOString().split('T')[0] } : ay
      )
    }

    activityLogs.unshift({
      id: `act-ay-${Date.now()}`,
      academicYearId: id,
      action: 'Academic Year Updated',
      details: `Configuration details modified for ${data.name || id}.`,
      performedBy: 'Current Administrator',
      timestamp: new Date().toLocaleString(),
    })

    return academicYears.find((ay) => ay.id === id)
  },

  setCurrentAcademicYear: async (id) => {
    await delay(250)
    const target = academicYears.find((ay) => ay.id === id)
    if (!target) throw new Error('Academic year not found')

    academicYears = academicYears.map((ay) => ({
      ...ay,
      isCurrent: ay.id === id,
      status: ay.id === id ? 'Active' : ay.status,
    }))

    activityLogs.unshift({
      id: `act-ay-${Date.now()}`,
      academicYearId: id,
      action: 'Set as Current Academic Year',
      details: `Active operational context switched to ${target.name}.`,
      performedBy: 'Current Administrator',
      timestamp: new Date().toLocaleString(),
    })

    return target
  },

  updateAcademicYearStatus: async (id, status) => {
    await delay(200)
    academicYears = academicYears.map((ay) =>
      ay.id === id ? { ...ay, status, updatedAt: new Date().toISOString().split('T')[0] } : ay
    )
    return academicYears.find((ay) => ay.id === id)
  },

  getAcademicYearActivity: async (id) => {
    await delay(100)
    return activityLogs.filter((log) => log.academicYearId === id)
  },

  getAcademicYearAssociatedEntities: async (id) => {
    await delay(150)
    const programs = MOCK_PROGRAMS.filter((p) =>
      p.applicableAcademicYears?.includes(id)
    )
    const classes = MOCK_CLASSES.filter((c) => c.academicYearId === id)
    const sections = MOCK_SECTIONS.filter((s) => s.academicYearId === id)

    return { programs, classes, sections }
  },
}
