// src/services/userService.js
import { MOCK_USERS } from './mockData'

const DEFAULT_PRODUCT_ROLES = {
  'usr-1': {
    platformRole: 'Organization Admin',
    productRoles: {
      academics: 'Academic Director',
      lms: 'Administrator',
      finance: 'Finance Controller',
      admissions: 'Head of Admissions',
      hrms: 'HR Administrator',
      library: 'Library Supervisor',
    },
  },
  'usr-2': {
    platformRole: 'Member',
    productRoles: {
      academics: 'Principal',
      lms: 'Instructor',
      finance: 'Viewer',
      admissions: 'Reviewer',
      hrms: 'No Access',
      library: 'No Access',
    },
  },
  'usr-3': {
    platformRole: 'Member',
    productRoles: {
      academics: 'No Access',
      lms: 'No Access',
      finance: 'No Access',
      admissions: 'Admissions Officer',
      hrms: 'No Access',
      library: 'No Access',
    },
  },
}

let users = MOCK_USERS.map((u) => {
  const rbac = DEFAULT_PRODUCT_ROLES[u.id] || {
    platformRole: u.role === 'Super Admin' ? 'Organization Admin' : 'Member',
    productRoles: {
      academics: u.role.includes('Academic') || u.role.includes('Principal') ? 'Academic Head' : 'Teacher',
      lms: 'Instructor',
      finance: u.role.includes('Finance') ? 'Accountant' : 'No Access',
      admissions: u.role.includes('Admission') ? 'Admissions Officer' : 'No Access',
    },
  }
  return {
    ...u,
    platformRole: rbac.platformRole,
    productRoles: rbac.productRoles,
  }
})

export const userService = {
  getUsers: async (filters = {}) => {
    await new Promise((r) => setTimeout(r, 100))
    let result = [...users]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          (u.mobile && u.mobile.includes(q))
      )
    }

    if (filters.role && filters.role !== 'all') {
      result = result.filter((u) => u.role === filters.role || u.platformRole === filters.role)
    }

    if (filters.product && filters.product !== 'all') {
      result = result.filter((u) => {
        const pRole = u.productRoles?.[filters.product]
        return pRole && pRole !== 'No Access'
      })
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((u) => u.status === filters.status)
    }

    if (filters.campus && filters.campus !== 'all') {
      result = result.filter((u) => u.campusId === filters.campus || u.campusId === 'all')
    }

    return result
  },

  getUserById: async (id) => {
    await new Promise((r) => setTimeout(r, 100))
    return users.find((u) => u.id === id)
  },

  createUser: async (userData) => {
    await new Promise((r) => setTimeout(r, 200))
    const newUser = {
      id: `usr-${Date.now()}`,
      name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.email.split('@')[0],
      lastLogin: 'Never',
      status: userData.status || 'Active',
      institution: 'ABC International School',
      platformRole: userData.platformRole || 'Member',
      productRoles: userData.productRoles || {
        academics: 'Teacher',
        lms: 'Instructor',
        finance: 'No Access',
      },
      ...userData,
    }
    users = [newUser, ...users]
    return newUser
  },

  updateUser: async (id, updatedData) => {
    await new Promise((r) => setTimeout(r, 150))
    users = users.map((u) => {
      if (u.id === id) {
        const merged = { ...u, ...updatedData }
        if (updatedData.firstName || updatedData.lastName) {
          merged.name = `${updatedData.firstName || u.firstName} ${updatedData.lastName || u.lastName}`.trim()
        }
        return merged
      }
      return u
    })
    return users.find((u) => u.id === id)
  },

  updateUserProductRoles: async (userId, productRoles, platformRole) => {
    await new Promise((r) => setTimeout(r, 150))
    users = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          platformRole: platformRole || u.platformRole,
          productRoles: { ...u.productRoles, ...productRoles },
        }
      }
      return u
    })
    return users.find((u) => u.id === userId)
  },

  toggleUserStatus: async (id) => {
    await new Promise((r) => setTimeout(r, 100))
    users = users.map((u) =>
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
    )
    return users.find((u) => u.id === id)
  },

  resetPassword: async (id) => {
    await new Promise((r) => setTimeout(r, 150))
    return { success: true, message: 'Password reset link sent to registered email' }
  },

  deleteUser: async (id) => {
    await new Promise((r) => setTimeout(r, 150))
    users = users.filter((u) => u.id !== id)
    return true
  },
}
