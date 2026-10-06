// src/modules/finance/services/studentFeeService.js
import { INITIAL_STUDENT_FEE_ASSIGNMENTS, INITIAL_INVOICES, INITIAL_PAYMENTS, INITIAL_RECEIPTS, INITIAL_REFUNDS } from '../data/financeMockData'
import { feeStructureService } from './feeStructureService'

let studentFeeAssignments: any[] = [...INITIAL_STUDENT_FEE_ASSIGNMENTS]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const studentFeeService = {
  getStudentFeeAssignments: async (filters: any = {}) => {
    await delay(120)
    let list = [...studentFeeAssignments]

    if (filters.campusId && filters.campusId !== 'all') {
      list = list.filter(item => item.campusId === filters.campusId)
    }
    if (filters.className && filters.className !== 'all') {
      list = list.filter(item => item.className === filters.className)
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(item => item.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(item =>
        item.studentName.toLowerCase().includes(q) ||
        item.studentId.toLowerCase().includes(q) ||
        item.rollNumber?.toLowerCase().includes(q)
      )
    }
    return list
  },

  getStudentFinanceProfile: async (studentId) => {
    await delay(100)
    const assignment = studentFeeAssignments.find(s => s.studentId === studentId) || {
      studentId,
      studentName: 'Student Record',
      rollNumber: studentId,
      campusName: 'Main Campus',
      programName: 'Undergraduate Program',
      className: 'Year 1',
      sectionName: 'Section A',
      feeStructureName: 'Standard University Fee',
      academicYearName: '2026–27',
      totalFees: 0,
      discountsApplied: 0,
      scholarshipsApplied: 0,
      netPayable: 0,
      paidAmount: 0,
      outstandingAmount: 0,
      overdueAmount: 0,
      status: 'Paid',
    }

    const invoices = INITIAL_INVOICES.filter(i => i.studentId === studentId)
    const payments = INITIAL_PAYMENTS.filter(p => p.studentId === studentId)
    const receipts = INITIAL_RECEIPTS.filter(r => r.studentId === studentId)
    const refunds = INITIAL_REFUNDS.filter(rf => rf.studentId === studentId)

    // Build timeline events
    const timeline = [
      ...invoices.map(i => ({
        id: `tl-inv-${i.id}`,
        title: `Invoice Generated: ${i.id}`,
        date: i.issueDate,
        type: 'invoice',
        amount: i.netAmount,
        description: `${i.installmentName} — Net: ₹${i.netAmount.toLocaleString('en-IN')}`,
      })),
      ...payments.map(p => ({
        id: `tl-pay-${p.id}`,
        title: `Payment Received: ${p.id}`,
        date: p.paymentDate,
        type: 'payment',
        amount: p.amount,
        description: `Via ${p.paymentMethod} (${p.gateway}) — Status: ${p.status}`,
      })),
      ...receipts.map(r => ({
        id: `tl-rcp-${r.id}`,
        title: `Receipt Issued: ${r.receiptNumber}`,
        date: r.paymentDate,
        type: 'receipt',
        amount: r.amount,
        description: `Official digital receipt verified by ${r.authorizedSignatory}`,
      })),
      ...refunds.map(rf => ({
        id: `tl-ref-${rf.id}`,
        title: `Refund ${rf.status}: ${rf.id}`,
        date: rf.requestedDate,
        type: 'refund',
        amount: rf.refundAmount,
        description: `${rf.reason} (Approved by: ${rf.approvedBy})`,
      })),
    ].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      assignment,
      invoices,
      payments,
      receipts,
      refunds,
      timeline,
    }
  },

  assignFeeStructure: async (studentId: any, feeStructureId: any, extra: any = {}) => {
    await delay(150)
    const fs = await feeStructureService.getFeeStructureById(feeStructureId)
    const existingIndex = studentFeeAssignments.findIndex(s => s.studentId === studentId)

    const newAssignment = {
      id: existingIndex >= 0 ? studentFeeAssignments[existingIndex].id : `sfa-${Date.now()}`,
      studentId,
      studentName: extra.studentName || 'Student Enrolled',
      rollNumber: extra.rollNumber || studentId,
      avatar: extra.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      campusId: fs.campusId,
      campusName: fs.campusName,
      programName: fs.programName,
      className: fs.className,
      sectionName: extra.sectionName || 'Section A',
      feeStructureId: fs.id,
      feeStructureName: fs.name,
      academicYearName: fs.academicYearName,
      totalFees: fs.totalAnnualAmount,
      discountsApplied: extra.discountsApplied || 0,
      scholarshipsApplied: extra.scholarshipsApplied || 0,
      netPayable: fs.totalAnnualAmount - (extra.discountsApplied || 0) - (extra.scholarshipsApplied || 0),
      paidAmount: 0,
      outstandingAmount: fs.totalAnnualAmount - (extra.discountsApplied || 0) - (extra.scholarshipsApplied || 0),
      overdueAmount: 0,
      nextDueDate: fs.installments?.[0]?.dueDate || '2026-07-15',
      status: 'Partially Paid',
      assignedDate: new Date().toISOString().split('T')[0],
      breakdown: fs.components.reduce((acc, c) => ({ ...acc, [c.type.toLowerCase().split(' ')[0]]: c.amount }), {}),
    }

    if (existingIndex >= 0) {
      studentFeeAssignments[existingIndex] = newAssignment
    } else {
      studentFeeAssignments.unshift(newAssignment)
    }

    return newAssignment
  },

  applyDiscount: async (studentId, { discountName, amount, reason, approvedBy }) => {
    await delay(120)
    const s = studentFeeAssignments.find(x => x.studentId === studentId)
    if (!s) throw new Error('Student fee assignment not found')

    s.discountsApplied = (s.discountsApplied || 0) + Number(amount)
    s.netPayable = Math.max(0, s.totalFees - s.discountsApplied - (s.scholarshipsApplied || 0))
    s.outstandingAmount = Math.max(0, s.netPayable - s.paidAmount)
    if (s.outstandingAmount === 0) s.status = 'Paid'
    return s
  },
}
