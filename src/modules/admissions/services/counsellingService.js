// src/modules/admissions/services/counsellingService.js
import { INITIAL_COUNSELLING } from '../data/counsellingMockData'

let sessions = [...INITIAL_COUNSELLING]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const counsellingService = {
  getCounsellingSessions: async (filters = {}) => {
    await delay(120)
    let result = [...sessions]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (s) =>
          s.applicantName?.toLowerCase().includes(q) ||
          s.counsellorName?.toLowerCase().includes(q) ||
          s.programName?.toLowerCase().includes(q)
      )
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((s) => s.status.toLowerCase() === filters.status.toLowerCase())
    }

    if (filters.mode && filters.mode !== 'all') {
      result = result.filter((s) => s.mode.toLowerCase() === filters.mode.toLowerCase())
    }

    return result
  },

  getCounsellingById: async (id) => {
    await delay(100)
    return sessions.find((s) => s.id === id) || null
  },

  scheduleCounselling: async (data) => {
    await delay(200)
    const newSession = {
      id: `coun-${Date.now()}`,
      status: 'Scheduled',
      outcome: null,
      ...data,
    }
    sessions = [newSession, ...sessions]
    return newSession
  },

  updateCounselling: async (id, updatedData) => {
    await delay(180)
    sessions = sessions.map((s) => (s.id === id ? { ...s, ...updatedData } : s))
    return sessions.find((s) => s.id === id)
  },

  completeCounselling: async (id, outcome, nextAction, notes) => {
    await delay(180)
    sessions = sessions.map((s) =>
      s.id === id
        ? {
            ...s,
            status: 'Completed',
            outcome,
            nextAction,
            notes: notes || s.notes,
          }
        : s
    )
    return sessions.find((s) => s.id === id)
  },
}
