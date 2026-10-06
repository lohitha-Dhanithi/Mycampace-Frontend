// src/modules/finance/services/reconciliationService.js
import { INITIAL_RECONCILIATION } from '../data/financeMockData'

let reconciliationList = [...INITIAL_RECONCILIATION]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const reconciliationService = {
  getReconciliations: async (filters: any = {}) => {
    await delay(120)
    let list = [...reconciliationList]
    if (filters.status && filters.status !== 'all') {
      list = list.filter(r => r.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.gateway && filters.gateway !== 'all') {
      list = list.filter(r => r.gateway.toLowerCase().includes(filters.gateway.toLowerCase()))
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(r =>
        r.transactionId.toLowerCase().includes(q) ||
        r.gatewayReference.toLowerCase().includes(q) ||
        r.internalReference.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q)
      )
    }
    return list
  },

  getReconciliationById: async (id) => {
    await delay(100)
    const found = reconciliationList.find(r => r.id === id || r.transactionId === id)
    if (!found) throw new Error(`Reconciliation record ${id} not found`)
    return { ...found }
  },

  markReconciled: async (id, notes = '') => {
    await delay(150)
    const item = reconciliationList.find(r => r.id === id)
    if (!item) throw new Error(`Reconciliation record ${id} not found`)
    item.status = 'Reconciled'
    ;(item as any).mismatch = null
    item.settlementDate = new Date().toISOString()
    ;(item as any).reconciliationNotes = notes || 'Manually reconciled by Finance Treasury'
    return { ...item }
  },

  uploadSettlementBatch: async (fileName, count = 5) => {
    await delay(250)
    const batchId = `STMT-AUTO-${Date.now().toString().slice(-6)}`
    return {
      batchId,
      fileName,
      totalRecords: count,
      matchedCount: count - 1,
      mismatchCount: 1,
      processedAt: new Date().toISOString(),
    }
  },
}
