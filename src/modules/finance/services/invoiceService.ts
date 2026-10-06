// src/modules/finance/services/invoiceService.js
import { INITIAL_INVOICES } from '../data/financeMockData'

let invoices = [...INITIAL_INVOICES]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const invoiceService = {
  getInvoices: async (filters: any = {}) => {
    await delay(120)
    let list = [...invoices]

    if (filters.status && filters.status !== 'all') {
      list = list.filter(item => item.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.campusId && filters.campusId !== 'all') {
      list = list.filter(item => item.campusName?.toLowerCase().includes(filters.campusId.toLowerCase()))
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(item =>
        item.id.toLowerCase().includes(q) ||
        item.studentName.toLowerCase().includes(q) ||
        item.rollNumber?.toLowerCase().includes(q)
      )
    }
    return list
  },

  getInvoiceById: async (id) => {
    await delay(100)
    const found = invoices.find(i => i.id === id)
    if (!found) throw new Error(`Invoice ${id} not found`)
    return { ...found }
  },

  createInvoice: async (data) => {
    await delay(150)
    const newId = `INV-2026-${String(invoices.length + 101).padStart(5, '0')}`
    const grossAmount = Number(data.grossAmount || 0)
    const discountAmount = Number(data.discountAmount || 0)
    const taxAmount = Number(data.taxAmount || 0)
    const netAmount = Math.max(0, grossAmount - discountAmount + taxAmount)

    const newInvoice = {
      id: newId,
      studentId: data.studentId,
      studentName: data.studentName,
      rollNumber: data.rollNumber || data.studentId,
      feeStructureName: data.feeStructureName || 'Standard Tuition Fee',
      academicYearName: data.academicYearName || '2026–27',
      campusName: data.campusName || 'Main Campus',
      grossAmount,
      discountAmount,
      taxAmount,
      netAmount,
      paidAmount: 0,
      outstandingAmount: netAmount,
      dueDate: data.dueDate || '2026-07-31',
      issueDate: new Date().toISOString().split('T')[0],
      status: 'Issued',
      installmentName: data.installmentName || 'General Tuition Demand',
      items: data.items || [{ description: 'Institutional Tuition Fee', amount: grossAmount }],
    }

    invoices.unshift(newInvoice)
    return newInvoice
  },

  updateInvoiceStatus: async (id, status) => {
    await delay(120)
    const item = invoices.find(i => i.id === id)
    if (!item) throw new Error(`Invoice ${id} not found`)
    item.status = status
    if (status === 'Paid') {
      item.paidAmount = item.netAmount
      item.outstandingAmount = 0
    }
    return { ...item }
  },

  cancelInvoice: async (id, reason) => {
    await delay(120)
    const item = invoices.find(i => i.id === id)
    if (!item) throw new Error(`Invoice ${id} not found`)
    item.status = 'Cancelled'
    ;(item as any).cancellationReason = reason
    return { ...item }
  },
}
