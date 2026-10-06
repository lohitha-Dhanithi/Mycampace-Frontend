// src/modules/finance/services/refundService.js
import { INITIAL_REFUNDS } from '../data/financeMockData'

let refunds = [...INITIAL_REFUNDS]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const refundService = {
  getRefunds: async (filters: any = {}) => {
    await delay(120)
    let list = [...refunds]
    if (filters.status && filters.status !== 'all') {
      list = list.filter(r => r.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(r =>
        r.id.toLowerCase().includes(q) ||
        r.studentName.toLowerCase().includes(q) ||
        r.paymentId?.toLowerCase().includes(q) ||
        r.reason?.toLowerCase().includes(q)
      )
    }
    return list
  },

  getRefundById: async (id) => {
    await delay(100)
    const found = refunds.find(r => r.id === id)
    if (!found) throw new Error(`Refund ${id} not found`)
    return { ...found }
  },

  requestRefund: async (data) => {
    await delay(150)
    const refundAmount = Number(data.refundAmount || 0)
    const refundableAmount = Number(data.refundableAmount || data.originalAmount || 0)

    if (refundAmount <= 0) {
      throw new Error('Refund amount must be greater than zero')
    }
    if (refundAmount > refundableAmount) {
      throw new Error(`Refund amount (₹${refundAmount}) cannot exceed refundable balance (₹${refundableAmount})`)
    }

    const newId = `RF-2026-${String(refunds.length + 14).padStart(3, '0')}`
    const now = new Date().toISOString()

    const newRefund = {
      id: newId,
      paymentId: data.paymentId,
      receiptId: data.receiptId || null,
      studentId: data.studentId,
      studentName: data.studentName,
      originalAmount: Number(data.originalAmount || refundAmount),
      refundableAmount,
      refundAmount,
      reason: data.reason || 'Student refund request',
      requestedBy: data.requestedBy || 'Student / Parent',
      approvedBy: 'Pending Review',
      status: 'Refund Requested',
      requestedDate: now,
      processedDate: null,
      payoutMode: data.payoutMode || 'Original Payment Source',
      payoutReference: null,
      timeline: [
        { step: 'Refund Requested', date: now.replace('T', ' ').slice(0, 16), by: data.requestedBy || 'Applicant' },
      ],
    }

    refunds.unshift(newRefund)
    return newRefund
  },

  updateRefundStatus: async (id: any, newStatus: any, options: any = {}) => {
    const { approvedBy, remarks, payoutReference } = options
    await delay(150)
    const item = refunds.find(r => r.id === id)
    if (!item) throw new Error(`Refund ${id} not found`)

    item.status = newStatus
    if (approvedBy) item.approvedBy = approvedBy
    if (payoutReference) item.payoutReference = payoutReference
    if (newStatus === 'Completed') item.processedDate = new Date().toISOString()

    ;(item.timeline as any[]).push({
      step: newStatus,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      by: approvedBy || 'Finance Officer',
      note: remarks || '',
    })

    return { ...item }
  },
}
