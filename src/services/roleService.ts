// src/services/roleService.ts
// Configurable Product Role Management with Custom Role Creation & Cloning

export interface ProductRole {
  id: string
  name: string
  description: string
  productId: string
  subProductId?: string
  organizationId?: string | null  // null = System Template, string = Custom Org Role
  isSystem: boolean
  status: 'Active' | 'Inactive'
  permissionIds: string[]
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'mycampace_roles_v2'

export const SYSTEM_ROLE_TEMPLATES: ProductRole[] = [
  // --- ACADEMICS ---
  {
    id: 'role-acad-dir',
    name: 'Academic Director',
    description: 'Executive governance across degree programs, institutional curricula, and faculty workload index.',
    productId: 'academics',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'academics.programs.view',
      'academics.programs.create',
      'academics.programs.update',
      'academics.programs.delete',
      'academics.courses.view',
      'academics.courses.manage',
      'academics.timetable.view',
      'academics.timetable.manage',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-acad-princ',
    name: 'Principal',
    description: 'Campus executive authority for timetable approvals, class section structures, and staff assignments.',
    productId: 'academics',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'academics.programs.view',
      'academics.courses.view',
      'academics.courses.manage',
      'academics.timetable.view',
      'academics.timetable.manage',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-acad-teach',
    name: 'Teacher / Faculty',
    description: 'Instructional staff viewing assigned courses, syllabi, class sections, and weekly periods.',
    productId: 'academics',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'academics.programs.view',
      'academics.courses.view',
      'academics.timetable.view',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },

  // --- LMS ---
  {
    id: 'role-lms-admin',
    name: 'LMS Administrator',
    description: 'Digital campus management, media library quotas, and school-wide assessment rubrics.',
    productId: 'lms',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'lms.courses.view',
      'lms.courses.manage',
      'lms.assignments.grade',
      'lms.quizzes.manage',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-lms-inst',
    name: 'Instructor / Trainer',
    description: 'Course author responsible for video lessons, homework assignments, and quiz creation.',
    productId: 'lms',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'lms.courses.view',
      'lms.courses.manage',
      'lms.assignments.grade',
      'lms.quizzes.manage',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },

  // --- FINANCE ---
  {
    id: 'role-fin-ctrl',
    name: 'Finance Controller',
    description: 'High-privilege authority over fee structures, offline payment reconciliation, and fee refunds.',
    productId: 'finance',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'finance.structures.view',
      'finance.structures.manage',
      'finance.invoices.view',
      'finance.invoices.create',
      'finance.payments.view',
      'finance.payments.reconcile',
      'finance.refunds.approve',
      'finance.reports.export',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-fin-cash',
    name: 'Fee Collection Cashier',
    description: 'Counter cashier issuing student fee receipts and accepting online or cash transactions.',
    productId: 'finance',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'finance.invoices.view',
      'finance.payments.view',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },

  // --- ADMISSIONS ---
  {
    id: 'role-adm-head',
    name: 'Head of Admissions',
    description: 'Oversees digital applications, counselor assignment, merit cutoffs, and applicant approval.',
    productId: 'admissions',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'admissions.leads.view',
      'admissions.leads.manage',
      'admissions.applications.review',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'role-adm-couns',
    name: 'Admissions Officer',
    description: 'Engages prospective candidates, logs inquiry feedback, and updates applicant stage.',
    productId: 'admissions',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'admissions.leads.view',
      'admissions.leads.manage',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },

  // --- HRMS ---
  {
    id: 'role-hrms-admin',
    name: 'HR Administrator',
    description: 'Manages employee records, compliance documents, leave approvals, and campus attendance rosters.',
    productId: 'hrms',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'hrms.staff.view',
      'hrms.staff.manage',
      'hrms.leaves.approve',
      'hrms.attendance.mark',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },

  // --- STUDENTS ---
  {
    id: 'role-stu-reg',
    name: 'Registrar & SIS Manager',
    description: 'Handles official student directory, roll lists, intra-campus transfers, and graduation exits.',
    productId: 'students',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'students.directory.view',
      'students.directory.manage',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },

  // --- LIBRARY ---
  {
    id: 'role-lib-sup',
    name: 'Library Supervisor',
    description: 'Maintains catalog records, circulation checkouts, and overdue fines.',
    productId: 'library',
    organizationId: null,
    isSystem: true,
    status: 'Active',
    permissionIds: [
      'library.catalog.view',
      'library.circulation.manage',
    ],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  },
]

class RoleService {
  private roles: ProductRole[] = []

  constructor() {
    this.load()
  }

  private load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        this.roles = JSON.parse(raw)
      } else {
        this.roles = [...SYSTEM_ROLE_TEMPLATES]
        this.save()
      }
    } catch {
      this.roles = [...SYSTEM_ROLE_TEMPLATES]
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.roles))
    } catch (e) {
      console.warn('Failed to persist roles in localStorage', e)
    }
  }

  getRoles(
    arg1?: { organizationId?: string | null; productId?: string; search?: string } | string,
    arg2?: string | null
  ): ProductRole[] {
    let productId: string | undefined
    let organizationId: string | null | undefined
    let search: string | undefined

    if (typeof arg1 === 'string' || arg2 !== undefined) {
      productId = typeof arg1 === 'string' ? arg1 : undefined
      organizationId = arg2
    } else if (arg1 && typeof arg1 === 'object') {
      productId = arg1.productId
      organizationId = arg1.organizationId
      search = arg1.search
    }

    let result = [...this.roles]

    if (productId && productId !== 'all') {
      result = result.filter((r) => r.productId === productId)
    }

    if (organizationId !== undefined && organizationId !== null) {
      result = result.filter(
        (r) => r.isSystem || r.organizationId === organizationId
      )
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.productId.toLowerCase().includes(q)
      )
    }

    return result
  }

  getRolesByProduct(productId: string, organizationId?: string | null): ProductRole[] {
    return this.getRoles({ productId, organizationId })
  }

  getRoleById(id: string): ProductRole | undefined {
    return this.roles.find((r) => r.id === id)
  }

  getRoleByName(name: string, productId: string): ProductRole | undefined {
    return this.roles.find((r) => r.name.toLowerCase() === name.toLowerCase() && r.productId === productId)
  }

  createRole(data: {
    name: string
    description: string
    productId: string
    subProductId?: string
    organizationId: string
    permissionIds: string[]
  }): ProductRole {
    const trimmed = data.name.trim()
    const duplicate = this.roles.find(
      (r) =>
        r.name.toLowerCase() === trimmed.toLowerCase() &&
        r.productId === data.productId &&
        (r.isSystem || r.organizationId === data.organizationId)
    )
    if (duplicate) {
      throw new Error(`A role named "${trimmed}" already exists for product "${data.productId}".`)
    }

    const newRole: ProductRole = {
      id: `role-custom-${Date.now()}`,
      name: trimmed,
      description: data.description.trim(),
      productId: data.productId,
      subProductId: data.subProductId,
      organizationId: data.organizationId,
      isSystem: false,
      status: 'Active',
      permissionIds: data.permissionIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.roles.push(newRole)
    this.save()
    return newRole
  }

  updateRole(
    id: string,
    updates: {
      name?: string
      description?: string
      permissionIds?: string[]
      status?: 'Active' | 'Inactive'
    }
  ): ProductRole {
    const index = this.roles.findIndex((r) => r.id === id)
    if (index === -1) throw new Error('Role not found')

    const role = this.roles[index]
    if (role.isSystem && updates.name && updates.name !== role.name) {
      throw new Error('System-defined default template names cannot be changed. Clone this role to create an organization-customized version.')
    }

    const updated: ProductRole = {
      ...role,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.roles[index] = updated
    this.save()
    return updated
  }

  cloneRole(id: string, newName: string, organizationId: string): ProductRole {
    const original = this.getRoleById(id)
    if (!original) throw new Error('Original role not found')

    return this.createRole({
      name: newName,
      description: `Custom copy of ${original.name}. ${original.description}`,
      productId: original.productId,
      subProductId: original.subProductId,
      organizationId,
      permissionIds: [...original.permissionIds],
    })
  }

  toggleRoleStatus(id: string): ProductRole {
    const role = this.getRoleById(id)
    if (!role) throw new Error('Role not found')
    const nextStatus = role.status === 'Active' ? 'Inactive' : 'Active'
    return this.updateRole(id, { status: nextStatus })
  }
}

export const roleService = new RoleService()
