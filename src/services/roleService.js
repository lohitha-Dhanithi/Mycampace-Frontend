// src/services/roleService.js
import { MOCK_ROLES, MOCK_PERMISSIONS_MODULES } from './mockData';

let roles = [...MOCK_ROLES];
let permissionModules = [...MOCK_PERMISSIONS_MODULES];

export const roleService = {
  getRoles: async () => {
    await new Promise((r) => setTimeout(r, 150));
    return [...roles];
  },

  getPermissionModules: async () => {
    await new Promise((r) => setTimeout(r, 150));
    return [...permissionModules];
  },

  createRole: async (roleData) => {
    await new Promise((r) => setTimeout(r, 200));
    const newRole = {
      id: `role-${Date.now()}`,
      userCount: 0,
      status: 'Active',
      isSystem: false,
      ...roleData,
    };
    roles = [newRole, ...roles];
    return newRole;
  },

  updateRole: async (id, updatedData) => {
    await new Promise((r) => setTimeout(r, 200));
    roles = roles.map((r) => (r.id === id ? { ...r, ...updatedData } : r));
    return roles.find((r) => r.id === id);
  },

  savePermissionsMatrix: async (roleId, matrix) => {
    await new Promise((r) => setTimeout(r, 250));
    return { success: true, message: 'Permissions updated successfully' };
  }
};
