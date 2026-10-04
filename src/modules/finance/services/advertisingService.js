// src/modules/finance/services/advertisingService.js
import { INITIAL_AD_INVENTORY, INITIAL_AD_REVENUE_SUMMARY } from '../data/advertisingMockData'

let adInventory = [...INITIAL_AD_INVENTORY]
let revenueSummary = { ...INITIAL_AD_REVENUE_SUMMARY }

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const advertisingService = {
  getInventory: async (filters = {}) => {
    await delay(120)
    let list = [...adInventory]
    if (filters.status && filters.status !== 'all') {
      list = list.filter(item => item.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.pricingModel && filters.pricingModel !== 'all') {
      list = list.filter(item => item.pricingModel.toLowerCase() === filters.pricingModel.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.audience.toLowerCase().includes(q)
      )
    }
    return list
  },

  getInventoryById: async (id) => {
    await delay(100)
    const found = adInventory.find(item => item.id === id)
    if (!found) throw new Error(`Placement ${id} not found`)
    return { ...found }
  },

  createPlacement: async (data) => {
    await delay(150)
    const newId = `pl-${Date.now()}`
    const newPlacement = {
      id: newId,
      name: data.name,
      location: data.location || 'Campus Digital Portal',
      format: data.format || 'Leaderboard',
      dimensions: data.dimensions || '728x90 px',
      audience: data.audience || 'All Campus Users',
      status: 'Active',
      pricingModel: data.pricingModel || 'CPM',
      baseRate: Number(data.baseRate || 200),
      dailyImpressionCapacity: Number(data.dailyImpressionCapacity || 5000),
      activeCampaignsCount: 0,
      description: data.description || '',
    }
    adInventory.push(newPlacement)
    return newPlacement
  },

  getRevenueSummary: async () => {
    await delay(100)
    return { ...revenueSummary }
  },
}
