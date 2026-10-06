// src/modules/academicConfiguration/services/departmentService.js
import { MOCK_DEPARTMENTS } from '../data/departmentMockData'

let departments = [...MOCK_DEPARTMENTS]
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const departmentService = {
  getDepartments: async () => {
    await delay()
    return [...departments]
  },

  getDepartmentById: async (id) => {
    await delay()
    return departments.find((d) => d.id === id) || null
  },

  createDepartment: async (data) => {
    await delay(250)
    const newRecord = {
      id: `dept-${Date.now()}`,
      institutionId: 'inst-001',
      facultyCount: 0,
      programsCount: 0,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    departments = [newRecord, ...departments]
    return newRecord
  },

  updateDepartment: async (id, data) => {
    await delay(250)
    departments = departments.map((d) =>
      d.id === id ? { ...d, ...data, updatedAt: new Date().toISOString().split('T')[0] } : d
    )
    return departments.find((d) => d.id === id)
  },

  deleteDepartment: async (id) => {
    await delay(250)
    const dept = departments.find((d) => d.id === id)
    if (!dept) throw new Error('Department not found')
    if (dept.programsCount > 0) {
      throw new Error(`Cannot delete: Department has ${dept.programsCount} active programs associated with it.`)
    }
    departments = departments.filter((d) => d.id !== id)
    return { success: true, id }
  },

  toggleDepartmentStatus: async (id) => {
    await delay(200)
    departments = departments.map((d) =>
      d.id === id ? { ...d, status: d.status === 'Active' ? 'Inactive' : 'Active' } : d
    )
    return departments.find((d) => d.id === id)
  },
}
