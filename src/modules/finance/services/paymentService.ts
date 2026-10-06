// src/modules/finance/services/paymentService.js
import { INITIAL_PAYMENTS } from '../data/financeMockData'
import { invoiceService } from './invoiceService'
import { receiptService } from './receiptService'

let payments = [...INITIAL_PAYMENTS]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const paymentService = {
  getPayments: async (filters: any = {}) => {
    await delay(120)
    let list = [...payments]

    if (filters.status && filters.status !== 'all') {
      list = list.filter(item => item.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      list = list.filter(item => item.paymentMethod.toLowerCase() === filters.paymentMethod.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(item =>
        item.id.toLowerCase().includes(q) ||
        item.studentName.toLowerCase().includes(q) ||
        item.invoiceId?.toLowerCase().includes(q) ||
        item.gatewayTransactionId?.toLowerCase().includes(q)
      )
    }
    return list
  },

  getPaymentById: async (id) => {
    await delay(100)
    const found = payments.find(p => p.id === id)
    if (!found) throw new Error(`Payment transaction ${id} not found`)
    return { ...found }
  },

  // Payment collection workflow (online gateway ready / offline counter ready)
  collectPayment: async (data) => {
    await delay(200)
    const newTxnId = `TXN-${Math.floor(100000 + Math.random() * 900000)}`
    const isOnline = ['Online', 'UPI', 'Card', 'Net Banking'].includes(data.paymentMethod)
    const gateway = isOnline ? (data.gateway || 'Razorpay Enterprise') : 'Counter Collection'
    const gatewayTxnId = isOnline
      ? (data.gatewayTransactionId || `pay_${Math.random().toString(36).substring(2, 12)}`)
      : `OFFLINE-REC-${Math.floor(1000 + Math.random() * 9000)}`

    // Generate matching receipt
    const receipt = await receiptService.createReceipt({
      invoiceId: data.invoiceId,
      transactionId: newTxnId,
      studentId: data.studentId,
      studentName: data.studentName,
      amount: Number(data.amount),
      paymentMethod: data.paymentMethod,
    })

    const newPayment = {
      id: newTxnId,
      invoiceId: data.invoiceId,
      receiptId: receipt.receiptNumber,
      studentId: data.studentId,
      studentName: data.studentName,
      rollNumber: data.rollNumber || data.studentId,
      amount: Number(data.amount),
      paymentMethod: data.paymentMethod || 'Online',
      gateway,
      gatewayTransactionId: gatewayTxnId,
      paymentDate: new Date().toISOString(),
      status: 'Success',
      settlementStatus: isOnline ? 'Pending Settlement' : 'Reconciled',
      settlementDate: isOnline ? null : new Date().toISOString(),
      notes: data.notes || `Collected via ${data.paymentMethod}`,
    }

    payments.unshift(newPayment)

    // Update invoice if applicable
    if (data.invoiceId) {
      try {
        const inv = await invoiceService.getInvoiceById(data.invoiceId)
        const updatedPaid = (inv.paidAmount || 0) + Number(data.amount)
        if (updatedPaid >= inv.netAmount) {
          await invoiceService.updateInvoiceStatus(data.invoiceId, 'Paid')
        } else {
          await invoiceService.updateInvoiceStatus(data.invoiceId, 'Partially Paid')
        }
      } catch (err) {
        console.warn('Could not auto-update invoice status:', err)
      }
    }

    return { payment: newPayment, receipt }
  },
}
