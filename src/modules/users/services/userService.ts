// src/modules/users/services/userService.js
// User Service Layer — returns mock data, designed for REST API replacement.

import { MOCK_USERS } from '../data/userMockData'

let users = [...MOCK_USERS]

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export const userService = {
  /**
   * Get all users, optionally filtered.
   */
  getUsers: async ({ role = 'all', status = 'all', campus = 'all', search = '' } = {}) => {
    await delay()
    let result = [...users]

    if (role !== 'all') result = result.filter((u) => u.role === role)
    if (status !== 'all') result = result.filter((u) => u.status === status)
    if (campus !== 'all') result = result.filter((u) => u.campusId === campus || u.campusId === 'all')
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.mobile?.includes(q) ||
          u.role.toLowerCase().includes(q)
      )
    }
    return result
  },

  /**
   * Get a single user by ID.
   */
  getUserById: async (id) => {
    await delay()
    return users.find((u) => u.id === id) || null
  },

  /**
   * Create a new user.
   */
  createUser: async (data) => {
    await delay(300)
    const newUser = {
      id: `usr-${Date.now()}`,
      name: `${data.firstName} ${data.lastName}`,
      lastLogin: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      twoFactorEnabled: false,
      lastPasswordChange: 'Not set',
      activeSessions: 0,
      inviteSent: data.sendInvite || false,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          title: 'Account Created',
          description: `New user account created for ${data.firstName} ${data.lastName}.`,
          timestamp: 'Just now',
          user: 'Institution Admin',
          type: 'info',
        },
      ],
      ...data,
    }
    users = [newUser, ...users]
    return newUser
  },

  /**
   * Update an existing user.
   */
  updateUser: async (id, data) => {
    await delay(300)
    users = users.map((u) =>
      u.id === id
        ? {
            ...u,
            ...data,
            name: `${data.firstName || u.firstName} ${data.lastName || u.lastName}`,
          }
        : u
    )
    return users.find((u) => u.id === id)
  },

  /**
   * Update user status (activate/deactivate/suspend).
   */
  updateUserStatus: async (id, status) => {
    await delay(200)
    users = users.map((u) => (u.id === id ? { ...u, status } : u))
    return { id, status }
  },

  /**
   * Legacy: toggle between Active/Inactive.
   */
  toggleUserStatus: async (id) => {
    await delay(200)
    const user = users.find((u) => u.id === id)
    const newStatus = user?.status === 'Active' ? 'Inactive' : 'Active'
    users = users.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    return { id, status: newStatus }
  },

  /**
   * Assign a role to a user.
   */
  assignRole: async (userId, roleId, roleName) => {
    await delay(200)
    users = users.map((u) =>
      u.id === userId ? { ...u, roleId, role: roleName } : u
    )
    return { userId, roleId, roleName }
  },

  /**
   * Remove a role from a user.
   */
  removeRole: async (userId) => {
    await delay(200)
    users = users.map((u) =>
      u.id === userId ? { ...u, roleId: null, role: 'No Role' } : u
    )
    return { userId }
  },

  /**
   * Send a password reset link.
   */
  resetPassword: async (id) => {
    await delay(300)
    return { id, sent: true }
  },

  /**
   * Get user statistics summary.
   */
  getUserStats: async () => {
    await delay(100)
    const total = users.length
    const active = users.filter((u) => u.status === 'Active').length
    const inactive = users.filter((u) => u.status === 'Inactive').length
    const invited = users.filter((u) => u.status === 'Invited').length
    const suspended = users.filter((u) => u.status === 'Suspended').length
    return { total, active, inactive, invited, suspended }
  },
}
