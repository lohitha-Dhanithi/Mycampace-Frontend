// src/modules/finance/services/advertisingCampaignService.js
import { INITIAL_AD_CAMPAIGNS } from '../data/advertisingMockData'

let campaigns = [...INITIAL_AD_CAMPAIGNS]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const advertisingCampaignService = {
  getCampaigns: async (filters = {}) => {
    await delay(120)
    let list = [...campaigns]
    if (filters.status && filters.status !== 'all') {
      list = list.filter(c => c.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.advertiserName.toLowerCase().includes(q)
      )
    }
    return list
  },

  getCampaignById: async (id) => {
    await delay(100)
    const found = campaigns.find(c => c.id === id)
    if (!found) throw new Error(`Campaign ${id} not found`)
    return { ...found }
  },

  createCampaign: async (data) => {
    await delay(150)
    const newId = `cmp-2026-${String(campaigns.length + 1).padStart(2, '0')}`
    const newCampaign = {
      id: newId,
      name: data.name,
      advertiserName: data.advertiserName,
      company: data.company,
      contact: data.contact,
      placementId: data.placementId || 'pl-student-dash',
      placementName: data.placementName || 'Student Dashboard Header Banner',
      startDate: data.startDate,
      endDate: data.endDate,
      budget: Number(data.budget || 0),
      impressions: 0,
      clicks: 0,
      ctr: 0.0,
      revenue: 0,
      status: 'Pending Approval',
      targetAudience: data.targetAudience || 'Students',
      targetCampuses: data.targetCampuses || ['Main Campus'],
      targetPrograms: data.targetPrograms || ['All Programs'],
      creativeUrl: data.creativeUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600',
      landingUrl: data.landingUrl || 'https://example.com',
      approvalAudit: {
        submittedAt: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null,
        remarks: 'Submitted for administrative compliance verification.',
      },
    }

    campaigns.unshift(newCampaign)
    return newCampaign
  },

  approveCampaign: async (id, approvedBy, remarks = '') => {
    await delay(120)
    const c = campaigns.find(item => item.id === id)
    if (!c) throw new Error(`Campaign ${id} not found`)
    c.status = 'Approved'
    c.approvalAudit = {
      ...c.approvalAudit,
      approvedBy,
      approvedAt: new Date().toISOString(),
      remarks: remarks || 'Approved by Institutional Media Board',
    }
    return { ...c }
  },

  rejectCampaign: async (id, rejectionReason) => {
    await delay(120)
    const c = campaigns.find(item => item.id === id)
    if (!c) throw new Error(`Campaign ${id} not found`)
    c.status = 'Rejected'
    c.rejectionReason = rejectionReason || 'Institutional policy rejection'
    return { ...c }
  },
}
