// src/modules/roles/services/roleService.js
// Role & Permission Service Layer — designed for REST API replacement.

import { MOCK_ROLES } from '../data/roleMockData'
import { PERMISSION_GROUPS, getAllModules, getEmptyPermissions } from '../data/permissionConfig'

let roles = [...MOCK_ROLES]

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export const roleService = {
  /**
   * Get all roles.
   */
  getRoles: async () => {
    await delay()
    return [...roles]
  },

  /**
   * Get a single role by ID.
   */
  getRoleById: async (id) => {
    await delay()
    return roles.find((r) => r.id === id) || null
  },

  /**
   * Create a new role.
   */
  createRole: async (data) => {
    await delay(300)
    const newRole = {
      id: `role-${Date.now()}`,
      userCount: 0,
      isSystem: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      permissions: data.templatePermissions || getEmptyPermissions(),
      ...data,
    }
    roles = [...roles, newRole]
    return newRole
  },

  /**
   * Update a role.
   */
  updateRole: async (id, data) => {
    await delay(300)
    roles = roles.map((r) =>
      r.id === id
        ? { ...r, ...data, updatedAt: new Date().toISOString().split('T')[0] }
        : r
    )
    return roles.find((r) => r.id === id)
  },

  /**
   * Delete a role (only custom, non-system roles with 0 users).
   */
  deleteRole: async (id) => {
    await delay(300)
    const role = roles.find((r) => r.id === id)
    if (!role) throw new Error('Role not found')
    if (role.isSystem) throw new Error('Cannot delete system roles')
    if (role.userCount > 0) throw new Error(`This role has ${role.userCount} assigned users`)
    roles = roles.filter((r) => r.id !== id)
    return { deleted: true, id }
  },

  /**
   * Update the permission matrix for a role.
   */
  updateRolePermissions: async (id, permissions) => {
    await delay(400)
    roles = roles.map((r) =>
      r.id === id
        ? {
            ...r,
            permissions,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : r
    )
    return { id, permissions }
  },

  /**
   * Duplicate a role.
   */
  duplicateRole: async (id) => {
    await delay(300)
    const original = roles.find((r) => r.id === id)
    if (!original) throw new Error('Role not found')
    const duplicate = {
      ...original,
      id: `role-${Date.now()}`,
      name: `${original.name} (Copy)`,
      code: `${original.code}_COPY`,
      isSystem: false,
      userCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    roles = [...roles, duplicate]
    return duplicate
  },

  /**
   * Get permission module groups (for matrix display).
   */
  getPermissionGroups: async () => {
    await delay(100)
    return PERMISSION_GROUPS
  },

  /**
   * Legacy: get flat permission modules list.
   */
  getPermissionModules: async () => {
    await delay(100)
    return getAllModules().map((mod) => ({
      ...mod,
      actions: {
        view: true,
        create: true,
        edit: true,
        delete: true,
        export: true,
        approve: true,
      },
    }))
  },

  /**
   * Legacy: save permission matrix (delegates to updateRolePermissions).
   */
  savePermissionsMatrix: async (id, permissions) => {
    return roleService.updateRolePermissions(id, permissions)
  },

  /**
   * Get role statistics.
   */
  getRoleStats: async () => {
    await delay(100)
    const total = roles.length
    const system = roles.filter((r) => r.isSystem).length
    const custom = roles.filter((r) => !r.isSystem).length
    const active = roles.filter((r) => r.status === 'Active').length
    return { total, system, custom, active }
  },
}
