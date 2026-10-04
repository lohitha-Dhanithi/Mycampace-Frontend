// src/modules/finance/services/receiptService.js
import { INITIAL_RECEIPTS } from '../data/financeMockData'

let receipts = [...INITIAL_RECEIPTS]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const receiptService = {
  getReceipts: async (filters = {}) => {
    await delay(120)
    let list = [...receipts]

    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      list = list.filter(item => item.paymentMethod.toLowerCase().includes(filters.paymentMethod.toLowerCase()))
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(item =>
        item.receiptNumber.toLowerCase().includes(q) ||
        item.studentName.toLowerCase().includes(q) ||
        item.invoiceId?.toLowerCase().includes(q) ||
        item.transactionId?.toLowerCase().includes(q)
      )
    }
    return list
  },

  getReceiptById: async (id) => {
    await delay(100)
    const found = receipts.find(r => r.id === id || r.receiptNumber === id)
    if (!found) throw new Error(`Receipt ${id} not found`)
    return { ...found }
  },

  createReceipt: async (data) => {
    const nextNum = String(receipts.length + 94).padStart(5, '0')
    const receiptNumber = `RCP-2026-${nextNum}`

    const newReceipt = {
      id: receiptNumber,
      receiptNumber,
      invoiceId: data.invoiceId,
      transactionId: data.transactionId,
      studentId: data.studentId,
      studentName: data.studentName,
      rollNumber: data.rollNumber || data.studentId,
      programName: data.programName || 'Degree Program',
      className: data.className || 'Undergraduate Year 1',
      amount: Number(data.amount),
      paymentMethod: data.paymentMethod || 'Online Gateway',
      paymentDate: new Date().toISOString(),
      status: 'Issued',
      authorizedSignatory: 'Finance Officer (University Treasury)',
      breakdown: [
        { name: 'Fee Settlement Amount', amount: Number(data.amount) },
      ],
    }

    receipts.unshift(newReceipt)
    return newReceipt
  },
}
