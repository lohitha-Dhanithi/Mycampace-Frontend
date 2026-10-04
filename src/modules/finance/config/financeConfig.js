// src/modules/finance/config/financeConfig.js
// Enterprise Finance Configuration — MyCampace Education ERP

export const FINANCE_CURRENCY = {
  code: 'INR',
  symbol: '₹',
  locale: 'en-IN',
}

export const PAYMENT_METHODS = [
  { id: 'online', label: 'Online Payment Gateway', icon: 'Globe' },
  { id: 'upi', label: 'UPI / QR Code', icon: 'QrCode' },
  { id: 'card', label: 'Credit / Debit Card', icon: 'CreditCard' },
  { id: 'netbanking', label: 'Net Banking', icon: 'Building' },
  { id: 'bank_transfer', label: 'NEFT / RTGS / IMPS', icon: 'ArrowLeftRight' },
  { id: 'cheque', label: 'Cheque / Demand Draft', icon: 'FileText' },
  { id: 'cash', label: 'Cash at Counter', icon: 'Banknote' },
  { id: 'other', label: 'Other / Sponsored', icon: 'MoreHorizontal' },
]

export const INVOICE_STATUSES = {
  DRAFT: { label: 'Draft', variant: 'secondary' },
  ISSUED: { label: 'Issued', variant: 'info' },
  PARTIALLY_PAID: { label: 'Partially Paid', variant: 'warning' },
  PAID: { label: 'Paid', variant: 'success' },
  OVERDUE: { label: 'Overdue', variant: 'destructive' },
  CANCELLED: { label: 'Cancelled', variant: 'secondary' },
}

export const PAYMENT_STATUSES = {
  PENDING: { label: 'Pending', variant: 'warning' },
  SUCCESS: { label: 'Success', variant: 'success' },
  FAILED: { label: 'Failed', variant: 'destructive' },
  REFUNDED: { label: 'Refunded', variant: 'secondary' },
  PARTIALLY_REFUNDED: { label: 'Partially Refunded', variant: 'warning' },
}

export const FEE_FREQUENCIES = [
  'One Time',
  'Monthly',
  'Quarterly',
  'Half Yearly',
  'Annual',
  'Custom',
]

export const FEE_COMPONENT_TYPES = [
  'Tuition Fee',
  'Admission Fee',
  'Examination Fee',
  'Library Fee',
  'Laboratory Fee',
  'Transport Fee',
  'Hostel Fee',
  'Technology Fee',
  'Development Fee',
  'Sports & Activities',
  'Other',
]

export const STUDENT_CATEGORIES = [
  'General',
  'OBC',
  'SC / ST',
  'Management Quota',
  'Merit Quota',
  'International / NRI',
  'Staff Ward',
  'Economically Weaker Section (EWS)',
]

export const REFUND_WORKFLOW_STATUSES = [
  'Refund Requested',
  'Under Review',
  'Approved',
  'Processing',
  'Processed',
  'Completed',
  'Rejected',
  'Cancelled',
]

export const RECONCILIATION_STATUSES = [
  'Matched',
  'Pending',
  'Mismatch',
  'Reconciled',
]

export const ADVERTISING_STATUSES = [
  'Draft',
  'Pending Approval',
  'Approved',
  'Scheduled',
  'Active',
  'Paused',
  'Completed',
  'Rejected',
]

export const AD_PRICING_MODELS = [
  'CPM', // Cost per mille (1000 impressions)
  'CPC', // Cost per click
  'Flat Fee',
  'Sponsored Placement',
]

export const AD_PLACEMENTS = [
  { id: 'pl-student-dash', name: 'Student Dashboard Banner', format: 'Leaderboard', dimensions: '728x90', audience: 'Students' },
  { id: 'pl-parent-dash', name: 'Parent Dashboard Banner', format: 'Banner', dimensions: '970x90', audience: 'Parents' },
  { id: 'pl-mobile-app', name: 'Mobile App Banner', format: 'Mobile Leaderboard', dimensions: '320x50', audience: 'All Users' },
  { id: 'pl-lms-banner', name: 'LMS Course Hub Banner', format: 'Medium Rectangle', dimensions: '300x250', audience: 'Students & Faculty' },
  { id: 'pl-finance-page', name: 'Finance Page Sponsor Slot', format: 'Half Page', dimensions: '300x600', audience: 'Parents & Students' },
  { id: 'pl-notice-board', name: 'Campus Digital Notice Board', format: 'Digital Display', dimensions: '1920x1080', audience: 'All Campus Visitors' },
  { id: 'pl-email-digest', name: 'Weekly Newsletter Placement', format: 'Native Ad', dimensions: '600x120', audience: 'Alumni & Parents' },
  { id: 'pl-inapp-card', name: 'In-App Promotional Card', format: 'Card Feature', dimensions: '400x200', audience: 'Eligible Students' },
]

export const LOAN_APPLICATION_STATUSES = [
  'Draft',
  'Submitted',
  'Under Review',
  'Additional Information Required',
  'Approved',
  'Rejected',
  'Disbursed',
  'Cancelled',
]

export const REMINDER_TRIGGER_DAYS = [
  { value: -7, label: '7 days before due date', channel: 'SMS, Email, WhatsApp' },
  { value: 0, label: 'On due date', channel: 'In-App, SMS, Email' },
  { value: 3, label: '3 days overdue', channel: 'SMS, WhatsApp' },
  { value: 7, label: '7 days overdue', channel: 'In-App, SMS, Email' },
  { value: 15, label: '15 days overdue', channel: 'SMS, WhatsApp, Email' },
  { value: 30, label: '30 days overdue', channel: 'Formal Notice / Registered Email' },
]

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
