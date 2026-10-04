// src/modules/admissions/data/admissionsDashboardMockData.js

export const INITIAL_ADMISSIONS_KPIS = {
  totalLeads: 48,
  newEnquiries: 18,
  activeApplications: 34,
  applicationsUnderReview: 14,
  approvedApplications: 22,
  enrolledStudents: 15,
  conversionRate: '31.2%',
  pendingFollowups: 9,
}

export const INITIAL_ADMISSION_FUNNEL = [
  { stage: 'Leads', count: 120, conversion: '100%', fill: '#3b82f6' },
  { stage: 'Enquiries', count: 84, conversion: '70.0%', fill: '#60a5fa' },
  { stage: 'Counselling', count: 56, conversion: '66.7%', fill: '#818cf8' },
  { stage: 'Applications', count: 38, conversion: '67.8%', fill: '#a78bfa' },
  { stage: 'Approved', count: 24, conversion: '63.1%', fill: '#34d399' },
  { stage: 'Enrolled', count: 18, conversion: '75.0%', fill: '#10b981' },
]

export const INITIAL_ADMISSIONS_ACTIVITIES = [
  {
    id: 'act-1',
    activity: 'Student Enrolled',
    details: 'Enrolment confirmed in Class 11 Section A (PCM)',
    user: 'Deepak Varma (Admissions Officer)',
    applicant: 'Aarav Patel',
    applicantId: 'app-101',
    date: '2026-10-02 11:30 AM',
    status: 'Enrolled',
  },
  {
    id: 'act-2',
    activity: 'Application Approved',
    details: 'Academic credentials verified and application accepted',
    user: 'Dr. Radhakrishnan Murthy (Director)',
    applicant: 'Ananya Deshmukh',
    applicantId: 'app-102',
    date: '2026-10-02 10:15 AM',
    status: 'Approved',
  },
  {
    id: 'act-3',
    activity: 'Document Uploaded',
    details: 'Transfer Certificate and Grade 10 Marksheet uploaded',
    user: 'Self / Parent Portal',
    applicant: 'Rohan Sharma',
    applicantId: 'app-103',
    date: '2026-10-01 04:45 PM',
    status: 'Under Review',
  },
  {
    id: 'act-4',
    activity: 'Counselling Completed',
    details: 'Campus visit and career counseling session conducted. High interest in STEM.',
    user: 'Pooja Iyer (Senior Counsellor)',
    applicant: 'Meera Nambiar',
    applicantId: 'lead-104',
    date: '2026-10-01 02:20 PM',
    status: 'Counselling',
  },
  {
    id: 'act-5',
    activity: 'Application Submitted',
    details: 'Online application submitted for Grade 11 Science',
    user: 'Self / Online Portal',
    applicant: 'Kavya Reddy',
    applicantId: 'app-105',
    date: '2026-09-30 06:10 PM',
    status: 'Submitted',
  },
  {
    id: 'act-6',
    activity: 'New Enquiry Logged',
    details: 'Inbound website enquiry received from parents regarding Senior Secondary stream',
    user: 'System Bot / Web Form',
    applicant: 'Vivaan Saxena',
    applicantId: 'enq-106',
    date: '2026-09-30 01:15 PM',
    status: 'New',
  },
]
