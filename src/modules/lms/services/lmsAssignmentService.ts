// src/modules/lms/services/lmsAssignmentService.js
import { INITIAL_LMS_ASSIGNMENTS } from '../data/lmsMockData'
import { lmsActivityService } from './lmsActivityService'

let assignments = [...INITIAL_LMS_ASSIGNMENTS]

const delay = (ms = 70) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsAssignmentService = {
  getAssignments: async (courseId) => {
    await delay(70)
    if (!courseId) return [...assignments]
    return assignments.filter((a) => a.courseId === courseId)
  },

  getAllAssignments: async (filters: any = {}) => {
    await delay(80)
    let result = [...assignments]
    if (filters.courseId && filters.courseId !== 'all') {
      result = result.filter((a) => a.courseId === filters.courseId)
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((a) => a.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (a) => a.title.toLowerCase().includes(q) || a.instructions.toLowerCase().includes(q)
      )
    }
    return result
  },

  getAssignmentById: async (id) => {
    await delay(60)
    return assignments.find((a) => a.id === id) || null
  },

  createAssignment: async (data) => {
    await delay(120)
    const newAssignment = {
      id: `asg-${Date.now().toString().slice(-4)}`,
      status: 'Published',
      submissionCount: 0,
      gradedCount: 0,
      pendingGradingCount: 0,
      averageScore: null,
      createdAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    assignments = [newAssignment, ...assignments]

    await lmsActivityService.logActivity({
      courseId: newAssignment.courseId,
      type: 'assignment_created',
      title: 'Assignment Created',
      description: `New assignment "${newAssignment.title}" published.`,
      actorName: 'Faculty',
      actorRole: 'Instructor',
    })

    return newAssignment
  },

  updateAssignment: async (id, updates) => {
    await delay(90)
    const index = assignments.findIndex((a) => a.id === id)
    if (index === -1) throw new Error('Assignment not found')
    assignments[index] = { ...assignments[index], ...updates }
    return assignments[index]
  },

  deleteAssignment: async (id) => {
    await delay(90)
    assignments = assignments.filter((a) => a.id !== id)
    return true
  },
}
