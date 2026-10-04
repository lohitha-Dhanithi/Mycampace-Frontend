// src/services/auditService.js

export const MOCK_AUDIT_LOGS = [
  {
    id: 'log-1',
    timestamp: '2026-10-04 11:32 AM',
    user: 'Vikram Aditya',
    email: 'vikram.aditya@abcschool.edu.in',
    action: 'ENTITLEMENT_ACTIVATED',
    product: 'HRMS',
    details: 'Activated 14-day trial license for HRMS module',
    ipAddress: '106.51.24.182',
    status: 'Success',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-04 10:15 AM',
    user: 'Dr. Meenakshi S.',
    email: 'meenakshi.s@abcschool.edu.in',
    action: 'CURRICULUM_UPDATE',
    product: 'Academics',
    details: 'Modified syllabus weightages for Grade 10 Science',
    ipAddress: '106.51.24.190',
    status: 'Success',
  },
  {
    id: 'log-3',
    timestamp: '2026-10-04 09:44 AM',
    user: 'Kavita Menon',
    email: 'kavita.m@abcschool.edu.in',
    action: 'FEE_STRUCTURE_PUBLISHED',
    product: 'Finance',
    details: 'Published Term 2 installment structure for 2026-27',
    ipAddress: '182.73.12.94',
    status: 'Success',
  },
  {
    id: 'log-4',
    timestamp: '2026-10-03 04:20 PM',
    user: 'Vikram Aditya',
    email: 'vikram.aditya@abcschool.edu.in',
    action: 'USER_ROLE_CHANGED',
    product: 'Platform',
    details: 'Assigned LMS Instructor role to Priya Sundar',
    ipAddress: '106.51.24.182',
    status: 'Success',
  },
]

export const auditService = {
  getLogs: async () => {
    return MOCK_AUDIT_LOGS
  },
  logAction: (action, product, details) => {
    console.log(`[AUDIT] ${action} (${product}): ${details}`)
  },
}
