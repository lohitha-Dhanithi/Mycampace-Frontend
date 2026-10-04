// src/modules/finance/services/financeReportService.js
import { INITIAL_STUDENT_FEE_ASSIGNMENTS, INITIAL_PAYMENTS, INITIAL_REFUNDS } from '../data/financeMockData'
import { INITIAL_AD_CAMPAIGNS } from '../data/advertisingMockData'
import { INITIAL_LOAN_APPLICATIONS } from '../data/dhanitiPayMockData'

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const financeReportService = {
  getCollectionsReport: async (filters = {}) => {
    await delay(120)
    const expected = INITIAL_STUDENT_FEE_ASSIGNMENTS.reduce((acc, s) => acc + s.netPayable, 0)
    const collected = INITIAL_STUDENT_FEE_ASSIGNMENTS.reduce((acc, s) => acc + s.paidAmount, 0)
    const outstanding = INITIAL_STUDENT_FEE_ASSIGNMENTS.reduce((acc, s) => acc + s.outstandingAmount, 0)
    const overdue = INITIAL_STUDENT_FEE_ASSIGNMENTS.reduce((acc, s) => acc + s.overdueAmount, 0)
    const rate = expected > 0 ? ((collected / expected) * 100).toFixed(1) : 0

    const rows = INITIAL_STUDENT_FEE_ASSIGNMENTS.map(s => ({
      student: s.studentName,
      studentId: s.studentId,
      program: s.programName,
      class: s.className,
      expected: s.netPayable,
      collected: s.paidAmount,
      outstanding: s.outstandingAmount,
      overdue: s.overdueAmount,
      status: s.status,
    }))

    return {
      summary: { expected, collected, outstanding, overdue, collectionRate: `${rate}%` },
      rows,
    }
  },

  getOutstandingDuesReport: async (filters = {}) => {
    await delay(120)
    const rows = INITIAL_STUDENT_FEE_ASSIGNMENTS
      .filter(s => s.outstandingAmount > 0)
      .map(s => ({
        student: s.studentName,
        studentId: s.studentId,
        program: s.programName,
        class: s.className,
        totalDue: s.netPayable,
        paid: s.paidAmount,
        outstanding: s.outstandingAmount,
        overdue: s.overdueAmount,
        nextDueDate: s.nextDueDate || 'Overdue',
      }))
    return rows
  },

  getPaymentTransactionsReport: async (filters = {}) => {
    await delay(120)
    return INITIAL_PAYMENTS.map(p => ({
      transactionId: p.id,
      student: p.studentName,
      invoice: p.invoiceId,
      amount: p.amount,
      gateway: p.gateway,
      method: p.paymentMethod,
      date: p.paymentDate,
      status: p.status,
      settlementStatus: p.settlementStatus,
    }))
  },

  getRefundsReport: async (filters = {}) => {
    await delay(120)
    return INITIAL_REFUNDS.map(r => ({
      refundId: r.id,
      originalPayment: r.paymentId,
      student: r.studentName,
      originalAmount: r.originalAmount,
      refundAmount: r.refundAmount,
      status: r.status,
      reason: r.reason,
      processedDate: r.processedDate || 'Pending',
    }))
  },

  getAdvertisingRevenueReport: async (filters = {}) => {
    await delay(120)
    return INITIAL_AD_CAMPAIGNS.map(c => ({
      campaign: c.name,
      advertiser: c.company,
      revenue: c.revenue,
      budget: c.budget,
      impressions: c.impressions,
      clicks: c.clicks,
      ctr: `${c.ctr}%`,
      status: c.status,
    }))
  },

  getFinancialServicesMetrics: async () => {
    await delay(120)
    const total = INITIAL_LOAN_APPLICATIONS.length
    const inProgress = INITIAL_LOAN_APPLICATIONS.filter(a => ['Submitted', 'Under Review', 'Additional Information Required'].includes(a.currentStatus)).length
    const approved = INITIAL_LOAN_APPLICATIONS.filter(a => a.currentStatus === 'Approved').length
    const disbursed = INITIAL_LOAN_APPLICATIONS.filter(a => a.currentStatus === 'Disbursed').length
    const rejected = INITIAL_LOAN_APPLICATIONS.filter(a => a.currentStatus === 'Rejected').length

    return {
      total,
      inProgress,
      approved,
      disbursed,
      rejected,
      rows: INITIAL_LOAN_APPLICATIONS.map(a => ({
        id: a.id,
        externalId: a.externalApplicationId,
        product: a.productName,
        applicant: a.applicantName,
        requestedAmount: a.requestedAmount,
        status: a.currentStatus,
        lastUpdated: a.lastUpdatedAt,
      })),
    }
  },
}
