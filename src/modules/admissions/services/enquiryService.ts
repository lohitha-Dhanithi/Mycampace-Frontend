// src/modules/admissions/services/enquiryService.js
import { INITIAL_ENQUIRIES } from '../data/enquiryMockData'

let enquiries = [...INITIAL_ENQUIRIES]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const enquiryService = {
  getEnquiries: async (filters: any = {}) => {
    await delay(120)
    let result = [...enquiries]

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter(
        (e) =>
          !e.campusId ||
          e.campusId === filters.campusId ||
          ((filters.campusId === 'camp-1' || filters.campusId === 'campus-main') &&
            (e.campusId === 'camp-1' || e.campusId === 'campus-main'))
      )
    }

    if (filters.academicYearId && filters.academicYearId !== 'all') {
      result = result.filter(
        (e) =>
          !e.academicYearId ||
          e.academicYearId === filters.academicYearId ||
          ((filters.academicYearId === 'ay-2026' || filters.academicYearId === 'ay-2026-27') &&
            (e.academicYearId === 'ay-2026' || e.academicYearId === 'ay-2026-27'))
      )
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (e) =>
          e.applicantName?.toLowerCase().includes(q) ||
          e.enquiryNumber?.toLowerCase().includes(q) ||
          e.email?.toLowerCase().includes(q) ||
          e.phone?.includes(q) ||
          e.programName?.toLowerCase().includes(q)
      )
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((e) => e.status.toLowerCase() === filters.status.toLowerCase())
    }

    return result
  },

  getEnquiryById: async (id) => {
    await delay(100)
    return enquiries.find((e) => e.id === id) || null
  },

  createEnquiry: async (enquiryData) => {
    await delay(200)
    const newEnquiry = {
      id: `enq-${Date.now()}`,
      enquiryNumber: `ENQ-2026-${String(enquiries.length + 1).padStart(3, '0')}`,
      enquiryDate: new Date().toISOString().split('T')[0],
      status: 'New',
      applicationId: null,
      ...enquiryData,
    }
    enquiries = [newEnquiry, ...enquiries]
    return newEnquiry
  },

  updateEnquiry: async (id, updatedData) => {
    await delay(180)
    enquiries = enquiries.map((e) => (e.id === id ? { ...e, ...updatedData } : e))
    return enquiries.find((e) => e.id === id)
  },

  convertEnquiryToApplication: async (id) => {
    await delay(200)
    const enquiry = enquiries.find((e) => e.id === id)
    if (!enquiry) throw new Error('Enquiry not found')

    const applicationId = enquiry.applicationId || `app-${Date.now()}`
    enquiry.status = 'Converted'
    enquiry.applicationId = applicationId
    return { enquiry, applicationId }
  },

  closeEnquiry: async (id, reason) => {
    await delay(150)
    enquiries = enquiries.map((e) =>
      e.id === id ? { ...e, status: 'Closed', closeReason: reason } : e
    )
    return enquiries.find((e) => e.id === id)
  },
}
