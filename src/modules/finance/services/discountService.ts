// src/modules/finance/services/discountService.js
import { INITIAL_DISCOUNTS } from '../data/financeMockData'

let discounts = [...INITIAL_DISCOUNTS]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const discountService = {
  getDiscounts: async (filters: any = {}) => {
    await delay(120)
    let list = [...discounts]
    if (filters.status && filters.status !== 'all') {
      list = list.filter(d => d.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.applicableComponent.toLowerCase().includes(q) ||
        d.approvedBy.toLowerCase().includes(q)
      )
    }
    return list
  },

  getDiscountById: async (id) => {
    await delay(100)
    const found = discounts.find(d => d.id === id)
    if (!found) throw new Error(`Discount ${id} not found`)
    return { ...found }
  },

  createDiscount: async (data) => {
    await delay(150)
    const newId = `dsc-${String(discounts.length + 1).padStart(3, '0')}`
    const newDiscount = {
      id: newId,
      name: data.name,
      type: data.type || 'Percentage Discount',
      value: Number(data.value || 0),
      applicableComponent: data.applicableComponent || 'Tuition Fee',
      maxDiscount: Number(data.maxDiscount || 0),
      effectiveDate: data.effectiveDate || new Date().toISOString().split('T')[0],
      approvedBy: data.approvedBy || 'Finance Committee',
      reason: data.reason || 'Institutional concession policy',
      status: 'Active',
      totalGranted: 0,
      auditTrail: [
        { date: new Date().toISOString().split('T')[0], action: 'Concession Policy Approved', user: data.approvedBy || 'Finance Head' },
      ],
    }

    discounts.unshift(newDiscount)
    return newDiscount
  },

  toggleStatus: async (id) => {
    await delay(120)
    const item = discounts.find(d => d.id === id)
    if (!item) throw new Error(`Discount ${id} not found`)
    item.status = item.status === 'Active' ? 'Inactive' : 'Active'
    return { ...item }
  },
}
