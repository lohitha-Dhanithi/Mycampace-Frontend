// src/modules/admissions/services/leadService.js
import { INITIAL_LEADS } from '../data/leadMockData'
import { LEAD_STAGE_TRANSITIONS } from '../config/admissionStatusConfig'

let leads = [...INITIAL_LEADS]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const leadService = {
  getLeads: async (filters: any = {}) => {
    await delay(120)
    let result = [...leads]

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter((l) => l.campusId === filters.campusId || !l.campusId)
    }

    if (filters.academicYearId && filters.academicYearId !== 'all') {
      result = result.filter((l) => l.academicYearId === filters.academicYearId || !l.academicYearId)
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (l) =>
          l.fullName?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.leadNumber?.toLowerCase().includes(q) ||
          l.programName?.toLowerCase().includes(q) ||
          l.source?.toLowerCase().includes(q)
      )
    }

    if (filters.stage && filters.stage !== 'all') {
      result = result.filter((l) => l.stage.toLowerCase() === filters.stage.toLowerCase())
    }

    if (filters.priority && filters.priority !== 'all') {
      result = result.filter((l) => l.priority.toLowerCase() === filters.priority.toLowerCase())
    }

    if (filters.source && filters.source !== 'all') {
      result = result.filter((l) => l.source === filters.source)
    }

    if (filters.counsellorId && filters.counsellorId !== 'all') {
      result = result.filter((l) => l.counsellorId === filters.counsellorId)
    }

    return result
  },

  getLeadById: async (id) => {
    await delay(100)
    return leads.find((l) => l.id === id) || null
  },

  createLead: async (leadData) => {
    await delay(200)
    const newId = `lead-${Date.now()}`
    const fullName = `${leadData.firstName || ''} ${leadData.lastName || ''}`.trim() || leadData.fullName || 'Prospective Lead'
    const newLead = {
      id: newId,
      leadNumber: `LEAD-2026-${String(leads.length + 1).padStart(3, '0')}`,
      fullName,
      stage: 'New',
      priority: leadData.priority || 'Medium',
      status: 'Active',
      lastContact: new Date().toISOString().split('T')[0],
      createdDate: new Date().toISOString().split('T')[0],
      enquiryId: null,
      applicationId: null,
      ...leadData,
    }
    leads = [newLead, ...leads]
    return newLead
  },

  updateLead: async (id, updatedData) => {
    await delay(180)
    leads = leads.map((l) => {
      if (l.id === id) {
        const merged = { ...l, ...updatedData }
        if (updatedData.firstName || updatedData.lastName) {
          merged.fullName = `${updatedData.firstName || l.firstName || ''} ${updatedData.lastName || l.lastName || ''}`.trim()
        }
        return merged
      }
      return l
    })
    return leads.find((l) => l.id === id)
  },

  updateLeadStage: async (id, newStage) => {
    await delay(150)
    const lead = leads.find((l) => l.id === id)
    if (!lead) throw new Error('Lead not found')

    const allowedTransitions = LEAD_STAGE_TRANSITIONS[lead.stage] || []
    if (allowedTransitions.length > 0 && !allowedTransitions.includes(newStage)) {
      throw new Error(`Invalid stage transition from "${lead.stage}" to "${newStage}"`)
    }

    lead.stage = newStage
    lead.lastContact = new Date().toISOString().split('T')[0]
    return { ...lead }
  },

  assignLead: async (id, counsellor) => {
    await delay(150)
    leads = leads.map((l) =>
      l.id === id
        ? {
            ...l,
            counsellorId: counsellor.id || counsellor.counsellorId,
            counsellorName: counsellor.name || counsellor.counsellorName,
          }
        : l
    )
    return leads.find((l) => l.id === id)
  },

  convertLeadToEnquiry: async (id) => {
    await delay(200)
    const lead = leads.find((l) => l.id === id)
    if (!lead) throw new Error('Lead not found')

    lead.stage = 'Qualified'
    const enquiryId = lead.enquiryId || `enq-${Date.now()}`
    lead.enquiryId = enquiryId
    return { lead, enquiryId }
  },

  archiveLead: async (id) => {
    await delay(150)
    leads = leads.map((l) => (l.id === id ? { ...l, status: 'Archived', stage: 'Lost' } : l))
    return true
  },
}
