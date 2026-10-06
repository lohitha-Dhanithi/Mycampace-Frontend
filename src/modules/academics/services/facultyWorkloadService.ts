// src/modules/academics/services/facultyWorkloadService.js
import { INITIAL_FACULTY_WORKLOAD } from '../data/facultyWorkloadMockData'
import { WORKLOAD_STATUSES } from '../config/facultyAssignmentConfig'

let workloads = [...INITIAL_FACULTY_WORKLOAD]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const facultyWorkloadService = {
  getFacultyWorkload: async (filters: any = {}) => {
    await delay(100)
    let result = [...workloads]

    if (filters.department && filters.department !== 'all') {
      result = result.filter((w) => w.department === filters.department)
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((w) => w.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (w) =>
          w.facultyName?.toLowerCase().includes(q) ||
          w.department?.toLowerCase().includes(q)
      )
    }

    return result
  },

  getFacultyWorkloadById: async (id: any) => {
    await delay(80)
    return workloads.find((w: any) => w.facultyId === id || w.id === id) || null
  },
}
