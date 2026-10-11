// src/services/userService.ts
import { MOCK_USERS } from './mockData'

export interface UserRecord {
  id: string
  name: string
  email: string
  mobile?: string
  organizationId: string
  institution?: string
  platformRole: 'Organization Admin' | 'Member' | 'Campus Admin'
  status: 'Active' | 'Inactive'
  lastLogin?: string
  productRoles: Record<string, string> // e.g. { academics: 'Academic Director', finance: 'No Access' }
  campusId?: string
}

const STORAGE_KEY = 'mycampace_users_directory_v2'

const DEFAULT_USERS: UserRecord[] = [
  {
    id: 'usr-1',
    name: 'Vikram Aditya',
    email: 'vikram.aditya@abcschool.edu.in',
    mobile: '+91 98480 12345',
    organizationId: 'org-1',
    institution: 'Apex Global Education Foundation',
    platformRole: 'Organization Admin',
    status: 'Active',
    lastLogin: 'Today, 10:45 AM',
    productRoles: {
      academics: 'Academic Director',
      lms: 'LMS Administrator',
      finance: 'Finance Controller',
      admissions: 'Head of Admissions',
      hrms: 'HR Administrator',
      library: 'Library Supervisor',
    },
  },
  {
    id: 'usr-2',
    name: 'Dr. Meenakshi Sundaram',
    email: 'meenakshi.s@abcschool.edu.in',
    mobile: '+91 98480 23456',
    organizationId: 'org-1',
    institution: 'Apex Global Education Foundation',
    platformRole: 'Member',
    status: 'Active',
    lastLogin: 'Yesterday, 04:12 PM',
    productRoles: {
      academics: 'Principal',
      lms: 'Instructor / Trainer',
      finance: 'Fee Collection Cashier',
      admissions: 'No Access',
      hrms: 'Staff',
      library: 'No Access',
    },
  },
  {
    id: 'usr-3',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@abcschool.edu.in',
    mobile: '+91 98480 34567',
    organizationId: 'org-1',
    institution: 'Apex Global Education Foundation',
    platformRole: 'Member',
    status: 'Active',
    lastLogin: '3 days ago',
    productRoles: {
      academics: 'Teacher / Faculty',
      lms: 'Instructor / Trainer',
      finance: 'No Access',
      admissions: 'Admissions Officer',
      hrms: 'No Access',
      library: 'No Access',
    },
  },
  {
    id: 'usr-4',
    name: 'Rajesh K. Nambiar',
    email: 'rajesh.n@abcschool.edu.in',
    mobile: '+91 98480 45678',
    organizationId: 'org-1',
    institution: 'Apex Global Education Foundation',
    platformRole: 'Member',
    status: 'Active',
    lastLogin: '1 week ago',
    productRoles: {
      academics: 'No Access',
      lms: 'No Access',
      finance: 'Fee Collection Cashier',
      admissions: 'No Access',
      hrms: 'No Access',
      library: 'Library Supervisor',
    },
  },
  {
    id: 'usr-5',
    name: 'Sunita Deshmukh',
    email: 'sunita.d@vidyabharati.org',
    mobile: '+91 99880 11223',
    organizationId: 'org-2',
    institution: 'Vidya Bharati Educational Trust',
    platformRole: 'Organization Admin',
    status: 'Active',
    lastLogin: 'Today, 09:30 AM',
    productRoles: {
      academics: 'Principal',
      lms: 'LMS Administrator',
      finance: 'Finance Controller',
    },
  },
]

function loadUsers(): UserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return [...DEFAULT_USERS]
}

function saveUsers(list: UserRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('Failed to save users in localStorage', e)
  }
}

export const userService = {
  getUsers: async (filters: {
    search?: string
    role?: string
    product?: string
    status?: string
    campus?: string
    organizationId?: string
  } = {}): Promise<UserRecord[]> => {
    await new Promise((r) => setTimeout(r, 60))
    let list = loadUsers()

    // Filter by organization context
    if (filters.organizationId) {
      list = list.filter((u) => u.organizationId === filters.organizationId)
    }

    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.mobile && u.mobile.includes(q)) ||
          Object.values(u.productRoles || {}).some((r) => r.toLowerCase().includes(q))
      )
    }

    if (filters.role && filters.role !== 'all') {
      list = list.filter((u) => u.platformRole === filters.role)
    }

    if (filters.product && filters.product !== 'all') {
      list = list.filter((u) => {
        const pRole = u.productRoles?.[filters.product]
        return pRole && pRole !== 'No Access'
      })
    }

    if (filters.status && filters.status !== 'all') {
      list = list.filter((u) => u.status === filters.status)
    }

    return list
  },

  getUserById: async (id: string): Promise<UserRecord | undefined> => {
    const list = loadUsers()
    return list.find((u) => u.id === id)
  },

  createUser: async (userData: {
    name: string
    email: string
    mobile?: string
    organizationId: string
    platformRole?: 'Organization Admin' | 'Member' | 'Campus Admin'
    productRoles?: Record<string, string>
    status?: 'Active' | 'Inactive'
  }): Promise<UserRecord> => {
    await new Promise((r) => setTimeout(r, 120))
    const list = loadUsers()

    if (list.some((u) => u.email.toLowerCase() === userData.email.toLowerCase().trim())) {
      throw new Error(`A user with email "${userData.email}" already exists.`)
    }

    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      mobile: userData.mobile?.trim() || '',
      organizationId: userData.organizationId || 'org-1',
      platformRole: userData.platformRole || 'Member',
      status: userData.status || 'Active',
      lastLogin: 'Never',
      productRoles: userData.productRoles || {},
    }

    const updated = [newUser, ...list]
    saveUsers(updated)
    return newUser
  },

  updateUser: async (
    id: string,
    updates: Partial<UserRecord>
  ): Promise<UserRecord> => {
    await new Promise((r) => setTimeout(r, 80))
    const list = loadUsers()
    const index = list.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('User not found')

    const updated = {
      ...list[index],
      ...updates,
    }
    list[index] = updated
    saveUsers(list)
    return updated
  },

  updateUserProductRoles: async (
    userId: string,
    productRoles: Record<string, string>,
    platformRole?: 'Organization Admin' | 'Member' | 'Campus Admin'
  ): Promise<UserRecord> => {
    await new Promise((r) => setTimeout(r, 80))
    const list = loadUsers()
    const index = list.findIndex((u) => u.id === userId)
    if (index === -1) throw new Error('User not found')

    const user = list[index]
    const updated: UserRecord = {
      ...user,
      platformRole: platformRole || user.platformRole,
      productRoles: { ...user.productRoles, ...productRoles },
    }
    list[index] = updated
    saveUsers(list)
    return updated
  },

  toggleUserStatus: async (id: string): Promise<UserRecord> => {
    await new Promise((r) => setTimeout(r, 60))
    const list = loadUsers()
    const index = list.findIndex((u) => u.id === id)
    if (index === -1) throw new Error('User not found')

    list[index].status = list[index].status === 'Active' ? 'Inactive' : 'Active'
    saveUsers(list)
    return list[index]
  },

  deleteUser: async (id: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 80))
    const list = loadUsers()
    const filtered = list.filter((u) => u.id !== id)
    saveUsers(filtered)
    return true
  },

  countUsersWithProductRole: (productId: string, roleName?: string, orgId?: string): number => {
    const list = loadUsers()
    return list.filter((u) => {
      if (orgId && u.organizationId !== orgId) return false
      const assigned = u.productRoles?.[productId]
      if (!assigned || assigned === 'No Access') return false
      if (roleName) return assigned.toLowerCase() === roleName.toLowerCase()
      return true
    }).length
  },
}
