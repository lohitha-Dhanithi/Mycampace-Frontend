// src/modules/academics/services/academicCalendarService.js
import { INITIAL_ACADEMIC_EVENTS } from '../data/academicCalendarMockData'

let events = [...INITIAL_ACADEMIC_EVENTS]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const academicCalendarService = {
  getAcademicEvents: async (filters = {}) => {
    await delay(100)
    let result = [...events]

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter((e) => e.campusId === filters.campusId || e.campusId === 'all')
    }
    if (filters.academicYearId && filters.academicYearId !== 'all') {
      result = result.filter((e) => e.academicYearId === filters.academicYearId)
    }
    if (filters.eventType && filters.eventType !== 'all') {
      result = result.filter((e) => e.eventType === filters.eventType)
    }
    if (filters.audience && filters.audience !== 'all') {
      result = result.filter((e) => e.audience === filters.audience || e.audience === 'all')
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((e) => e.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (e) =>
          e.eventName?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.scope?.toLowerCase().includes(q)
      )
    }

    return result
  },

  getAcademicEventById: async (id) => {
    await delay(80)
    return events.find((e) => e.id === id) || null
  },

  createAcademicEvent: async (data) => {
    await delay(180)
    const newEvt = {
      id: `evt-${Date.now()}`,
      status: 'Published',
      campusName: 'Hyderabad Main Campus',
      academicYearId: 'ay-2026-27',
      scope: 'Campus Wide',
      audience: 'all',
      ...data,
    }
    events = [newEvt, ...events]
    return newEvt
  },

  updateAcademicEvent: async (id, data) => {
    await delay(150)
    events = events.map((e) => (e.id === id ? { ...e, ...data } : e))
    return events.find((e) => e.id === id)
  },

  publishAcademicEvent: async (id) => {
    await delay(120)
    const evt = events.find((e) => e.id === id)
    if (evt) evt.status = 'Published'
    return evt
  },

  cancelAcademicEvent: async (id) => {
    await delay(120)
    const evt = events.find((e) => e.id === id)
    if (evt) evt.status = 'Cancelled'
    return evt
  },

  deleteAcademicEvent: async (id) => {
    await delay(120)
    events = events.filter((e) => e.id !== id)
    return true
  },
}
