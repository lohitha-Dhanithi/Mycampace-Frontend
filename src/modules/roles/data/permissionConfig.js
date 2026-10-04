// src/modules/roles/data/permissionConfig.js
// Enterprise Permission Configuration — MyCampace RBAC System
// Structured for easy addition of new modules.

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete', 'export', 'approve']

export const PERMISSION_ACTION_LABELS = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
  export: 'Export',
  approve: 'Approve',
}

/**
 * Permission Groups define logical sections of the permission matrix.
 * Each group contains modules. Each module defines which actions are applicable.
 */
export const PERMISSION_GROUPS = [
  {
    id: 'grp-core',
    label: 'Core',
    description: 'Platform and institution-level administrative controls',
    modules: [
      {
        id: 'mod-dashboard',
        name: 'Dashboard',
        description: 'Overview metrics and KPI dashboards',
        applicableActions: ['view', 'export'],
      },
      {
        id: 'mod-institution',
        name: 'Institution',
        description: 'Institution profile, branding and configurations',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-campus',
        name: 'Campus',
        description: 'Campus management, locations and contacts',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-users',
        name: 'Users',
        description: 'User accounts, access control and status management',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-roles',
        name: 'Roles & Permissions',
        description: 'Role definitions and permission matrix configuration',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-settings',
        name: 'Settings',
        description: 'System-wide configuration and preferences',
        applicableActions: ['view', 'edit', 'export'],
      },
    ],
  },
  {
    id: 'grp-admissions',
    label: 'Admissions',
    description: 'Enrollment, CRM and application pipeline',
    modules: [
      {
        id: 'mod-leads',
        name: 'Leads & Enquiries',
        description: 'Prospect tracking and lead management',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-applications',
        name: 'Applications',
        description: 'Student application processing and evaluation',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-counselling',
        name: 'Counselling',
        description: 'Admission counselling sessions and follow-ups',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-admissions',
        name: 'Admissions Processing',
        description: 'Final admission decisions and enrollment confirmation',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
    ],
  },
  {
    id: 'grp-students',
    label: 'Students',
    description: 'Student information system and records',
    modules: [
      {
        id: 'mod-students',
        name: 'Student Profiles',
        description: 'Student registration, demographics and academic records',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-documents',
        name: 'Documents',
        description: 'Student documents, certificates and compliance files',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-guardians',
        name: 'Parent / Guardian',
        description: 'Guardian profiles, communication and portal access',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-transfers',
        name: 'Transfers',
        description: 'Internal campus, section reallocation and external transfers',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-promotions',
        name: 'Promotions',
        description: 'Academic year cohort progression and promotions',
        applicableActions: ['view', 'create', 'edit', 'export', 'approve'],
      },
      {
        id: 'mod-exits',
        name: 'Exits & Clearances',
        description: 'Graduation, withdrawals and inter-department clearances',
        applicableActions: ['view', 'create', 'edit', 'export', 'approve'],
      },
      {
        id: 'mod-imports',
        name: 'Bulk Imports',
        description: 'Bulk student roster spreadsheet ingestion and validation',
        applicableActions: ['view', 'create', 'export'],
      },
    ],
  },
  {
    id: 'grp-academics',
    label: 'Academics',
    description: 'Academic configuration and curriculum management',
    modules: [
      {
        id: 'mod-academic-years',
        name: 'Academic Years',
        description: 'Academic year and term definitions',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-programs',
        name: 'Programs',
        description: 'Educational programs and curriculum frameworks',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-courses',
        name: 'Courses',
        description: 'Course catalog and learning units',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-classes',
        name: 'Classes & Sections',
        description: 'Class groupings and section management',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-subjects',
        name: 'Subjects',
        description: 'Subject definitions, codes and mappings',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-timetable',
        name: 'Timetable',
        description: 'Class scheduling, period definitions and room allocation',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-faculty-assignments',
        name: 'Faculty Assignments',
        description: 'Teaching assignments, educator deployment and substitutions',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-subject-assignments',
        name: 'Subject Assignments',
        description: 'Mapping syllabus subjects to classroom sections',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-class-teachers',
        name: 'Class Teachers',
        description: 'Homeroom mentor allocation and section leadership',
        applicableActions: ['view', 'create', 'edit', 'export'],
      },
      {
        id: 'mod-enrolments',
        name: 'Student Enrolments',
        description: 'Student cohort placement and section reallocations',
        applicableActions: ['view', 'create', 'edit', 'export'],
      },
      {
        id: 'mod-academic-calendar',
        name: 'Academic Calendar',
        description: 'Term milestones, examination sessions, and institutional events',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-workload',
        name: 'Faculty Workload',
        description: 'Educator teaching load distribution and capacity monitoring',
        applicableActions: ['view', 'export'],
      },
    ],
  },
  {
    id: 'grp-lms',
    label: 'Learning Management (LMS)',
    description: 'Digital courses, lesson content, assignments, quizzes, and learning progress',
    modules: [
      {
        id: 'mod-lms-courses',
        name: 'LMS Courses',
        description: 'Digital course catalog, academic mappings, and publishing',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-lms-content',
        name: 'Modules & Content Library',
        description: 'Lesson content, video lectures, reading materials, and resource library',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-lms-assignments',
        name: 'Assignments & Submissions',
        description: 'Assignment creation, student submissions, and grading rubrics',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-lms-quizzes',
        name: 'Quizzes & Question Banks',
        description: 'Online quizzes, question sets, and student attempt logs',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-lms-students',
        name: 'Student Learning Progress',
        description: 'Cohort enrollment, lesson completion tracking, and student analytics',
        applicableActions: ['view', 'create', 'edit', 'export'],
      },
      {
        id: 'mod-lms-reports',
        name: 'LMS Reports',
        description: 'Course completion, student pacing, and assessment performance reports',
        applicableActions: ['view', 'export'],
      },
    ],
  },
  {
    id: 'grp-operations',
    label: 'Operations',
    description: 'Day-to-day operational functions',
    modules: [
      {
        id: 'mod-attendance',
        name: 'Attendance',
        description: 'Student and staff attendance tracking',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-examinations',
        name: 'Examinations',
        description: 'Exam scheduling, grading and report cards',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-communication',
        name: 'Communication',
        description: 'Bulk messaging, notices and parent-teacher communication',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
    ],
  },
  {
    id: 'grp-finance',
    label: 'Finance & Accounts',
    description: 'Fee structures, student billing ledger, demand invoices, receipts, and bank reconciliation',
    modules: [
      {
        id: 'mod-fee-structures',
        name: 'Fee Structures & Schedules',
        description: 'Configure academic fee structures, components, and installment timelines',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-student-fees',
        name: 'Student Fees & Accounts',
        description: 'Assign fee structures, track student balances, and manage dues',
        applicableActions: ['view', 'create', 'edit', 'export'],
      },
      {
        id: 'mod-invoices-payments',
        name: 'Invoices & Payments',
        description: 'Generate demand invoices, collect fee payments, and issue receipts',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-concessions-scholarships',
        name: 'Discounts & Scholarships',
        description: 'Manage concession waivers, merit scholarships, and grant approvals',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
      {
        id: 'mod-refunds-reconciliation',
        name: 'Refunds & Reconciliation',
        description: 'Multi-stage refund processing and payment gateway reconciliation',
        applicableActions: ['view', 'create', 'edit', 'export', 'approve'],
      },
    ],
  },
  {
    id: 'grp-advertising',
    label: 'Campus Advertising',
    description: 'Institutional advertising inventory, sponsored campaigns, and media revenue',
    modules: [
      {
        id: 'mod-ad-inventory',
        name: 'Ad Inventory & Placements',
        description: 'Configure institutional digital placements and pricing models',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export'],
      },
      {
        id: 'mod-ad-campaigns',
        name: 'Sponsored Campaigns',
        description: 'Campaign creation, audience targeting, and administrative approvals',
        applicableActions: ['view', 'create', 'edit', 'delete', 'export', 'approve'],
      },
    ],
  },
  {
    id: 'grp-financial-services',
    label: 'Financial Services (DhanitiPay)',
    description: 'Education loan discovery, eligibility pre-checks, and application tracking',
    modules: [
      {
        id: 'mod-loan-products',
        name: 'Loan Product Discovery',
        description: 'Catalog of verified education finance and skill loan programs',
        applicableActions: ['view', 'export'],
      },
      {
        id: 'mod-loan-applications',
        name: 'Loan Applications & Status',
        description: 'Track application submissions, required documents, and lender underwriting status',
        applicableActions: ['view', 'create', 'edit', 'export'],
      },
    ],
  },
  {
    id: 'grp-administration',
    label: 'Administration',
    description: 'System administration and compliance',
    modules: [
      {
        id: 'mod-audit',
        name: 'Audit Logs',
        description: 'System audit trail and compliance reporting',
        applicableActions: ['view', 'export'],
      },
      {
        id: 'mod-system',
        name: 'System Settings',
        description: 'Advanced platform configuration and integrations',
        applicableActions: ['view', 'edit', 'export'],
      },
    ],
  },
]

/**
 * Helper: Flatten all modules from all groups into a single array.
 */
export function getAllModules() {
  return PERMISSION_GROUPS.flatMap((g) => g.modules)
}

/**
 * Role permission templates — used for "Start from template" feature.
 * Values are: true = permission granted, false = not granted, undefined = not applicable.
 */
export const ROLE_TEMPLATES = {
  'Institution Admin': {
    'mod-dashboard': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-institution': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-campus': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-users': { view: true, create: true, edit: true, delete: true, export: true, approve: false },
    'mod-roles': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-settings': { view: true, create: false, edit: true, delete: false, export: true, approve: false },
    'mod-leads': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-applications': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-counselling': { view: true, create: true, edit: true, delete: true, export: true, approve: false },
    'mod-admissions': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-students': { view: true, create: true, edit: true, delete: true, export: true, approve: false },
    'mod-documents': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-guardians': { view: true, create: true, edit: true, delete: true, export: true, approve: false },
    'mod-academic-years': { view: true, create: true, edit: true, delete: true, export: true, approve: false },
    'mod-programs': { view: true, create: true, edit: true, delete: true, export: true, approve: false },
    'mod-courses': { view: true, create: true, edit: true, delete: true, export: true, approve: false },
    'mod-classes': { view: true, create: true, edit: true, delete: true, export: true, approve: false },
    'mod-subjects': { view: true, create: true, edit: true, delete: true, export: true, approve: false },
    'mod-timetable': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-attendance': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-examinations': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-finance': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-communication': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-audit': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-system': { view: true, create: false, edit: true, delete: false, export: true, approve: false },
  },
  Principal: {
    'mod-dashboard': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-institution': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-campus': { view: true, create: false, edit: true, delete: false, export: true, approve: false },
    'mod-users': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-roles': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-settings': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-leads': { view: true, create: false, edit: false, delete: false, export: true, approve: true },
    'mod-applications': { view: true, create: false, edit: false, delete: false, export: true, approve: true },
    'mod-counselling': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-admissions': { view: true, create: false, edit: false, delete: false, export: true, approve: true },
    'mod-students': { view: true, create: false, edit: true, delete: false, export: true, approve: false },
    'mod-documents': { view: true, create: false, edit: false, delete: false, export: true, approve: true },
    'mod-guardians': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-academic-years': { view: true, create: false, edit: true, delete: false, export: true, approve: false },
    'mod-programs': { view: true, create: false, edit: true, delete: false, export: true, approve: false },
    'mod-courses': { view: true, create: false, edit: true, delete: false, export: true, approve: false },
    'mod-classes': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-subjects': { view: true, create: false, edit: true, delete: false, export: true, approve: false },
    'mod-timetable': { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    'mod-attendance': { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    'mod-examinations': { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    'mod-finance': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-communication': { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    'mod-audit': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-system': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
  },
  Teacher: {
    'mod-dashboard': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-institution': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-campus': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-users': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-roles': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-settings': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-leads': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-applications': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-counselling': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-admissions': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-students': { view: true, create: false, edit: true, delete: false, export: false, approve: false },
    'mod-documents': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-guardians': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-academic-years': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-programs': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-courses': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-classes': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-subjects': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-timetable': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-attendance': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-examinations': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-finance': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-communication': { view: true, create: true, edit: false, delete: false, export: false, approve: false },
    'mod-audit': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-system': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
  },
  Accountant: {
    'mod-dashboard': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-institution': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-campus': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-users': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-roles': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-settings': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-leads': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-applications': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-counselling': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-admissions': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-students': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-documents': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-guardians': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-academic-years': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-programs': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-courses': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-classes': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-subjects': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-timetable': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-attendance': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-examinations': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-finance': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-communication': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-audit': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-system': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
  },
  'Admissions Officer': {
    'mod-dashboard': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-institution': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-campus': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-users': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-roles': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-settings': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-leads': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-applications': { view: true, create: true, edit: true, delete: true, export: true, approve: true },
    'mod-counselling': { view: true, create: true, edit: true, delete: true, export: true, approve: false },
    'mod-admissions': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-students': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-documents': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-guardians': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-academic-years': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-programs': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-courses': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-classes': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-subjects': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-timetable': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-attendance': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-examinations': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-finance': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-communication': { view: true, create: true, edit: false, delete: false, export: false, approve: false },
    'mod-audit': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-system': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
  },
  'HR Admin': {
    'mod-dashboard': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-institution': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-campus': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-users': { view: true, create: true, edit: true, delete: false, export: true, approve: false },
    'mod-roles': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-settings': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-leads': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-applications': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-counselling': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-admissions': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-students': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-documents': { view: true, create: true, edit: true, delete: false, export: true, approve: true },
    'mod-guardians': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-academic-years': { view: true, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-programs': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-courses': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-classes': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-subjects': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-timetable': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-attendance': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-examinations': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
    'mod-finance': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-communication': { view: true, create: true, edit: false, delete: false, export: false, approve: false },
    'mod-audit': { view: true, create: false, edit: false, delete: false, export: true, approve: false },
    'mod-system': { view: false, create: false, edit: false, delete: false, export: false, approve: false },
  },
}

/**
 * Super Admin full permissions (all true)
 */
export function getSuperAdminPermissions() {
  const perms = {}
  getAllModules().forEach((mod) => {
    perms[mod.id] = {}
    PERMISSION_ACTIONS.forEach((action) => {
      perms[mod.id][action] = mod.applicableActions.includes(action)
    })
  })
  return perms
}

/**
 * Empty permissions template (all false)
 */
export function getEmptyPermissions() {
  const perms = {}
  getAllModules().forEach((mod) => {
    perms[mod.id] = {}
    PERMISSION_ACTIONS.forEach((action) => {
      perms[mod.id][action] = false
    })
  })
  return perms
}
