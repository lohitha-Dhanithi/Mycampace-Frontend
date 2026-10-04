// src/modules/admissions/services/followUpService.js
import { INITIAL_FOLLOWUPS } from '../data/followUpMockData'

let followUps = [...INITIAL_FOLLOWUPS]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const followUpService = {
  getFollowUps: async (filters = {}) => {
    await delay(120)
    let result = [...followUps]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (f) =>
          f.applicantName?.toLowerCase().includes(q) ||
          f.assignedToName?.toLowerCase().includes(q) ||
          f.purpose?.toLowerCase().includes(q)
      )
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((f) => f.status.toLowerCase() === filters.status.toLowerCase())
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter((f) => f.type.toLowerCase() === filters.type.toLowerCase())
    }

    if (filters.assignedToId && filters.assignedToId !== 'all') {
      result = result.filter((f) => f.assignedToId === filters.assignedToId)
    }

    return result
  },

  getFollowUpById: async (id) => {
    await delay(100)
    return followUps.find((f) => f.id === id) || null
  },

  createFollowUp: async (data) => {
    await delay(200)
    const newFollowUp = {
      id: `fol-${Date.now()}`,
      status: 'Pending',
      outcome: null,
      createdDate: new Date().toISOString().split('T')[0],
      ...data,
    }
    followUps = [newFollowUp, ...followUps]
    return newFollowUp
  },

  updateFollowUp: async (id, updatedData) => {
    await delay(180)
    followUps = followUps.map((f) => (f.id === id ? { ...f, ...updatedData } : f))
    return followUps.find((f) => f.id === id)
  },

  completeFollowUp: async (id, outcome, notes) => {
    await delay(180)
    followUps = followUps.map((f) =>
      f.id === id
        ? {
            ...f,
            status: 'Completed',
            outcome: outcome || 'Follow-up successfully resolved',
            notes: notes ? `${f.notes || ''} | ${notes}` : f.notes,
          }
        : f
    )
    return followUps.find((f) => f.id === id)
  },
}
