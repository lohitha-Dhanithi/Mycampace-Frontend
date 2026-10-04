// src/modules/finance/services/scholarshipService.js
import { INITIAL_SCHOLARSHIPS } from '../data/financeMockData'

let scholarships = [...INITIAL_SCHOLARSHIPS]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const scholarshipService = {
  getScholarships: async (filters = {}) => {
    await delay(120)
    let list = [...scholarships]
    if (filters.type && filters.type !== 'all') {
      list = list.filter(s => s.type.toLowerCase() === filters.type.toLowerCase())
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(s => s.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.eligibility.toLowerCase().includes(q) ||
        s.fundingSource?.toLowerCase().includes(q)
      )
    }
    return list
  },

  getScholarshipById: async (id) => {
    await delay(100)
    const found = scholarships.find(s => s.id === id)
    if (!found) throw new Error(`Scholarship ${id} not found`)
    return { ...found }
  },

  createScholarship: async (data) => {
    await delay(150)
    const newId = `sch-${String(scholarships.length + 1).padStart(3, '0')}`
    const newScholarship = {
      id: newId,
      name: data.name,
      type: data.type || 'Merit',
      eligibility: data.eligibility || 'Institutional review required',
      benefitType: data.benefitType || 'Fixed Amount',
      amount: Number(data.amount || 0),
      academicYearName: data.academicYearName || '2026–27',
      startDate: data.startDate || '2026-06-01',
      endDate: data.endDate || '2027-05-31',
      status: 'Active',
      beneficiariesCount: 0,
      fundingSource: data.fundingSource || 'University Scholarship Corpus',
    }

    scholarships.unshift(newScholarship)
    return newScholarship
  },
}
