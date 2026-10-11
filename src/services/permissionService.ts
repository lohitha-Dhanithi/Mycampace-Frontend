// src/services/permissionService.ts
// Centralized Permission Registry & Action Matrix for MyCampace RBAC

export interface Permission {
  id: string              // e.g. 'academics.programs.view'
  productId: string       // e.g. 'academics'
  subProductId?: string   // e.g. 'timetable'
  resource: string        // e.g. 'programs', 'courses', 'invoices', 'staff'
  resourceName: string    // e.g. 'Programs & Degrees'
  action: 'view' | 'create' | 'update' | 'delete' | 'approve' | 'export' | 'manage'
  name: string            // e.g. 'View Programs'
  description: string
  isSensitive?: boolean
}

export const INITIAL_PERMISSIONS: Permission[] = [
  // --- ACADEMICS ---
  {
    id: 'academics.programs.view',
    productId: 'academics',
    resource: 'programs',
    resourceName: 'Programs & Degrees',
    action: 'view',
    name: 'View Programs',
    description: 'Browse academic programs, degrees, and duration structures.',
  },
  {
    id: 'academics.programs.create',
    productId: 'academics',
    resource: 'programs',
    resourceName: 'Programs & Degrees',
    action: 'create',
    name: 'Create Programs',
    description: 'Add new academic degree programs and curricula.',
  },
  {
    id: 'academics.programs.update',
    productId: 'academics',
    resource: 'programs',
    resourceName: 'Programs & Degrees',
    action: 'update',
    name: 'Edit Programs',
    description: 'Modify program structures and requirements.',
  },
  {
    id: 'academics.programs.delete',
    productId: 'academics',
    resource: 'programs',
    resourceName: 'Programs & Degrees',
    action: 'delete',
    name: 'Delete Programs',
    description: 'Remove obsolete academic programs from catalog.',
    isSensitive: true,
  },
  {
    id: 'academics.courses.view',
    productId: 'academics',
    resource: 'courses',
    resourceName: 'Courses & Curricula',
    action: 'view',
    name: 'View Courses',
    description: 'Read course catalog, credits, and syllabi.',
  },
  {
    id: 'academics.courses.manage',
    productId: 'academics',
    resource: 'courses',
    resourceName: 'Courses & Curricula',
    action: 'manage',
    name: 'Manage Courses',
    description: 'Create, update, and organize courses.',
  },
  {
    id: 'academics.timetable.view',
    productId: 'academics',
    subProductId: 'timetable',
    resource: 'timetable',
    resourceName: 'Timetable & Scheduling',
    action: 'view',
    name: 'View Timetables',
    description: 'View class and faculty weekly bell schedules.',
  },
  {
    id: 'academics.timetable.manage',
    productId: 'academics',
    subProductId: 'timetable',
    resource: 'timetable',
    resourceName: 'Timetable & Scheduling',
    action: 'manage',
    name: 'Manage Timetables',
    description: 'Edit class period slots, room allocations, and bell schedules.',
    isSensitive: true,
  },

  // --- LMS ---
  {
    id: 'lms.courses.view',
    productId: 'lms',
    resource: 'courses',
    resourceName: 'Digital Course Content',
    action: 'view',
    name: 'View Courses',
    description: 'Access digital lessons and materials.',
  },
  {
    id: 'lms.courses.manage',
    productId: 'lms',
    resource: 'courses',
    resourceName: 'Digital Course Content',
    action: 'manage',
    name: 'Author Course Modules',
    description: 'Create, publish, and edit lessons and modules.',
  },
  {
    id: 'lms.assignments.grade',
    productId: 'lms',
    resource: 'assignments',
    resourceName: 'Assignments & Submissions',
    action: 'approve',
    name: 'Grade Submissions',
    description: 'Evaluate student work and assign scores.',
  },
  {
    id: 'lms.quizzes.manage',
    productId: 'lms',
    resource: 'quizzes',
    resourceName: 'Quizzes & Tests',
    action: 'manage',
    name: 'Manage Quizzes',
    description: 'Build quiz questions, timers, and rubrics.',
  },

  // --- FINANCE ---
  {
    id: 'finance.structures.view',
    productId: 'finance',
    resource: 'structures',
    resourceName: 'Fee Structures',
    action: 'view',
    name: 'View Fee Structures',
    description: 'View institutional fee plans and component breakdowns.',
  },
  {
    id: 'finance.structures.manage',
    productId: 'finance',
    resource: 'structures',
    resourceName: 'Fee Structures',
    action: 'manage',
    name: 'Manage Fee Structures',
    description: 'Create, update, or deprecate fee structures.',
    isSensitive: true,
  },
  {
    id: 'finance.invoices.view',
    productId: 'finance',
    resource: 'invoices',
    resourceName: 'Student Invoices',
    action: 'view',
    name: 'View Invoices',
    description: 'Browse student dues and invoice ledgers.',
  },
  {
    id: 'finance.invoices.create',
    productId: 'finance',
    resource: 'invoices',
    resourceName: 'Student Invoices',
    action: 'create',
    name: 'Generate Invoices',
    description: 'Issue fee bills to students or classes.',
  },
  {
    id: 'finance.payments.view',
    productId: 'finance',
    resource: 'payments',
    resourceName: 'Payments & Receipts',
    action: 'view',
    name: 'View Receipts',
    description: 'Inspect transaction receipts and settlements.',
  },
  {
    id: 'finance.payments.reconcile',
    productId: 'finance',
    resource: 'payments',
    resourceName: 'Payments & Receipts',
    action: 'approve',
    name: 'Reconcile Bank Feeds',
    description: 'Reconcile gateway settlement batches.',
    isSensitive: true,
  },
  {
    id: 'finance.refunds.approve',
    productId: 'finance',
    resource: 'refunds',
    resourceName: 'Refunds & Adjustments',
    action: 'approve',
    name: 'Approve Fee Refunds',
    description: 'Authorize fee disbursement refunds to students.',
    isSensitive: true,
  },
  {
    id: 'finance.reports.export',
    productId: 'finance',
    resource: 'reports',
    resourceName: 'Financial Reports',
    action: 'export',
    name: 'Export Ledgers & Audits',
    description: 'Download CSV and Excel collections reports.',
    isSensitive: true,
  },

  // --- ADMISSIONS ---
  {
    id: 'admissions.leads.view',
    productId: 'admissions',
    resource: 'leads',
    resourceName: 'Inquiries & Leads',
    action: 'view',
    name: 'View Leads',
    description: 'Review prospect pipeline and inquiries.',
  },
  {
    id: 'admissions.leads.manage',
    productId: 'admissions',
    resource: 'leads',
    resourceName: 'Inquiries & Leads',
    action: 'manage',
    name: 'Manage Leads',
    description: 'Assign counselors and update prospect stages.',
  },
  {
    id: 'admissions.applications.review',
    productId: 'admissions',
    resource: 'applications',
    resourceName: 'Digital Applications',
    action: 'approve',
    name: 'Review Applications',
    description: 'Verify certificates and approve or reject submissions.',
    isSensitive: true,
  },

  // --- HRMS ---
  {
    id: 'hrms.staff.view',
    productId: 'hrms',
    resource: 'staff',
    resourceName: 'Personnel Records',
    action: 'view',
    name: 'View Staff Directory',
    description: 'Search employee directory and profiles.',
  },
  {
    id: 'hrms.staff.manage',
    productId: 'hrms',
    resource: 'staff',
    resourceName: 'Personnel Records',
    action: 'manage',
    name: 'Manage Staff Records',
    description: 'Add new staff, upload vault documents, and edit job titles.',
    isSensitive: true,
  },
  {
    id: 'hrms.leaves.approve',
    productId: 'hrms',
    resource: 'leaves',
    resourceName: 'Leave Management',
    action: 'approve',
    name: 'Approve Leave Requests',
    description: 'Grant or reject employee time-off requests.',
  },
  {
    id: 'hrms.attendance.mark',
    productId: 'hrms',
    resource: 'attendance',
    resourceName: 'Daily Shift Attendance',
    action: 'manage',
    name: 'Mark Campus Attendance',
    description: 'Check staff in/out and assign roster shifts.',
  },

  // --- STUDENTS (SIS) ---
  {
    id: 'students.directory.view',
    productId: 'students',
    resource: 'directory',
    resourceName: 'Student Records',
    action: 'view',
    name: 'View Student Directory',
    description: 'Browse enrolled student profiles and lifecycle records.',
  },
  {
    id: 'students.directory.manage',
    productId: 'students',
    resource: 'directory',
    resourceName: 'Student Records',
    action: 'manage',
    name: 'Manage Student Lifecycle',
    description: 'Process promotions, transfers, and alumni exits.',
    isSensitive: true,
  },

  // --- LIBRARY (Extensibility Example) ---
  {
    id: 'library.catalog.view',
    productId: 'library',
    resource: 'catalog',
    resourceName: 'Book Inventory',
    action: 'view',
    name: 'View Library Catalog',
    description: 'Search books, ISBNs, and physical copy locations.',
  },
  {
    id: 'library.circulation.manage',
    productId: 'library',
    resource: 'circulation',
    resourceName: 'Borrowing & Circulation',
    action: 'manage',
    name: 'Issue & Return Books',
    description: 'Check out copies and calculate overdue late fines.',
  },
]

class PermissionService {
  private permissions: Permission[] = [...INITIAL_PERMISSIONS]

  getPermissions(productId?: string): Permission[] {
    if (!productId || productId === 'all') return [...this.permissions]
    return this.permissions.filter((p) => p.productId === productId)
  }

  getPermissionById(id: string): Permission | undefined {
    return this.permissions.find((p) => p.id === id)
  }

  getGroupedPermissions(productId?: string): Record<string, Permission[]> {
    const list = this.getPermissions(productId)
    const grouped: Record<string, Permission[]> = {}
    for (const p of list) {
      const groupKey = `${p.productId.toUpperCase()} — ${p.resourceName}`
      if (!grouped[groupKey]) grouped[groupKey] = []
      grouped[groupKey].push(p)
    }
    return grouped
  }

  registerProductPermissions(productId: string, newPermissions: Permission[]): void {
    const existingIds = new Set(this.permissions.map((p) => p.id))
    for (const p of newPermissions) {
      if (!existingIds.has(p.id)) {
        this.permissions.push(p)
      }
    }
  }
}

export const permissionService = new PermissionService()
