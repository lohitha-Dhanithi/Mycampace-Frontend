// src/modules/students/data/studentFeeMockData.js

export const INITIAL_STUDENT_FEES = {
  'stu-101': {
    totalFees: 185000,
    paid: 120000,
    pending: 65000,
    overdue: 0,
    currency: 'INR',
    feePlan: 'Standard Annual Installment Scheme',
    transactions: [
      {
        id: 'txn-001',
        date: '2026-09-29',
        receiptNumber: 'RCP-2026-9041',
        description: 'Admission & Term 1 Tuition Fee',
        amount: 85000,
        mode: 'Online (Razorpay / NetBanking)',
        status: 'Paid',
      },
      {
        id: 'txn-002',
        date: '2026-10-01',
        receiptNumber: 'RCP-2026-9112',
        description: 'Annual Laboratory & Library Fee',
        amount: 35000,
        mode: 'UPI (GPay / PhonePe)',
        status: 'Paid',
      },
      {
        id: 'txn-003',
        date: '2026-12-15',
        receiptNumber: 'INV-2026-1102',
        description: 'Term 2 Tuition Installment',
        amount: 65000,
        mode: 'Pending Payment',
        status: 'Pending',
      },
    ],
  },
  'stu-102': {
    totalFees: 175000,
    paid: 175000,
    pending: 0,
    overdue: 0,
    currency: 'INR',
    feePlan: 'One-Time Lump Sum Payment',
    transactions: [
      {
        id: 'txn-004',
        date: '2026-09-15',
        receiptNumber: 'RCP-2026-8840',
        description: 'Full Academic Year Annual Fee',
        amount: 175000,
        mode: 'NEFT / RTGS Bank Transfer',
        status: 'Paid',
      },
    ],
  },
}
