// src/modules/finance/services/financeService.js
import {
  INITIAL_FEE_STRUCTURES,
  INITIAL_STUDENT_FEE_ASSIGNMENTS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_RECEIPTS,
  INITIAL_REFUNDS,
} from '../data/financeMockData'
import { INITIAL_AD_CAMPAIGNS } from '../data/advertisingMockData'
import { INITIAL_LOAN_APPLICATIONS } from '../data/dhanitiPayMockData'

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const financeService = {
  getDashboardKPIs: async (filters = {}) => {
    await delay(120)
    // Calculate aggregate totals from student fee assignments
    const totalFeesAssigned = INITIAL_STUDENT_FEE_ASSIGNMENTS.reduce((sum, s) => sum + (s.totalFees || 0), 0)
    const totalDiscounts = INITIAL_STUDENT_FEE_ASSIGNMENTS.reduce((sum, s) => sum + (s.discountsApplied || 0) + (s.scholarshipsApplied || 0), 0)
    const netAssigned = totalFeesAssigned - totalDiscounts
    const collected = INITIAL_STUDENT_FEE_ASSIGNMENTS.reduce((sum, s) => sum + (s.paidAmount || 0), 0)
    const outstanding = INITIAL_STUDENT_FEE_ASSIGNMENTS.reduce((sum, s) => sum + (s.outstandingAmount || 0), 0)
    const overdue = INITIAL_STUDENT_FEE_ASSIGNMENTS.reduce((sum, s) => sum + (s.overdueAmount || 0), 0)
    const collectionRate = netAssigned > 0 ? Math.round((collected / netAssigned) * 100) : 0

    const pendingRefunds = INITIAL_REFUNDS.filter(r => ['Refund Requested', 'Under Review', 'Processing'].includes(r.status))
      .reduce((sum, r) => sum + (r.refundAmount || 0), 0)

    const todayCollections = 25000 // Sample daily run
    const thisMonthCollections = collected
    const expectedCollections = outstanding + overdue

    return {
      totalFeesAssigned: netAssigned,
      grossFeesAssigned: totalFeesAssigned,
      totalDiscounts,
      collected,
      outstanding,
      overdue,
      collectionRate,
      pendingRefunds,
      todayCollections,
      thisMonthCollections,
      expectedCollections,
    }
  },

  getCollectionChartData: async (filters = {}) => {
    await delay(100)
    return [
      { month: 'Apr 2026', expected: 450000, collected: 420000, outstanding: 30000 },
      { month: 'May 2026', expected: 520000, collected: 490000, outstanding: 30000 },
      { month: 'Jun 2026', expected: 890000, collected: 810000, outstanding: 80000 },
      { month: 'Jul 2026', expected: 640000, collected: 580000, outstanding: 60000 },
      { month: 'Aug 2026', expected: 410000, collected: 360000, outstanding: 50000 },
      { month: 'Sep 2026', expected: 780000, collected: 620000, outstanding: 160000 },
    ]
  },

  getCollectionBreakdownByCategory: async () => {
    await delay(100)
    return [
      { name: 'Tuition Fee', value: 480000, color: '#2563eb' },
      { name: 'Admission & Reg', value: 75000, color: '#10b981' },
      { name: 'Lab & Equipment', value: 55000, color: '#8b5cf6' },
      { name: 'Library & Tech', value: 45000, color: '#f59e0b' },
      { name: 'Hostel & Transport', value: 92000, color: '#ec4899' },
    ]
  },

  getRecentTransactions: async (limit = 10) => {
    await delay(100)
    return [...INITIAL_PAYMENTS].slice(0, limit)
  },

  unifiedSearch: async (query = '') => {
    await delay(150)
    if (!query || query.trim() === '') return { students: [], invoices: [], payments: [], receipts: [], campaigns: [], loans: [] }
    const q = query.toLowerCase()

    const students = INITIAL_STUDENT_FEE_ASSIGNMENTS.filter(s =>
      s.studentName.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q)
    )

    const invoices = INITIAL_INVOICES.filter(i =>
      i.id.toLowerCase().includes(q) || i.studentName.toLowerCase().includes(q)
    )

    const payments = INITIAL_PAYMENTS.filter(p =>
      p.id.toLowerCase().includes(q) || p.studentName.toLowerCase().includes(q) || (p.gatewayTransactionId && p.gatewayTransactionId.toLowerCase().includes(q))
    )

    const receipts = INITIAL_RECEIPTS.filter(r =>
      r.receiptNumber.toLowerCase().includes(q) || r.studentName.toLowerCase().includes(q)
    )

    const campaigns = INITIAL_AD_CAMPAIGNS.filter(c =>
      c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
    )

    const loans = INITIAL_LOAN_APPLICATIONS.filter(l =>
      l.id.toLowerCase().includes(q) || l.studentName.toLowerCase().includes(q) || l.externalApplicationId.toLowerCase().includes(q)
    )

    return { students, invoices, payments, receipts, campaigns, loans }
  },
}
