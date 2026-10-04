// src/modules/academicConfiguration/services/courseService.js
import { MOCK_COURSES } from '../data/courseMockData'
import { MOCK_SUBJECTS } from '../data/subjectMockData'

let courses = [...MOCK_COURSES]
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const courseService = {
  getCourses: async (filters = {}) => {
    await delay()
    let result = [...courses]
    if (filters.programId) {
      result = result.filter((c) => c.programId === filters.programId)
    }
    if (filters.departmentId) {
      result = result.filter((c) => c.departmentId === filters.departmentId)
    }
    return result
  },

  getCourseById: async (id) => {
    await delay()
    return courses.find((c) => c.id === id) || null
  },

  createCourse: async (data) => {
    await delay(250)
    const newRecord = {
      id: `crs-${Date.now()}`,
      institutionId: 'inst-001',
      campusId: 'camp-001',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    courses = [newRecord, ...courses]
    return newRecord
  },

  updateCourse: async (id, data) => {
    await delay(250)
    courses = courses.map((c) =>
      c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString().split('T')[0] } : c
    )
    return courses.find((c) => c.id === id)
  },

  deleteCourse: async (id) => {
    await delay(250)
    const linkedSubjects = MOCK_SUBJECTS.filter((s) => s.courseId === id)
    if (linkedSubjects.length > 0) {
      throw new Error(`Cannot delete course: ${linkedSubjects.length} subjects are currently mapped to it.`)
    }
    courses = courses.filter((c) => c.id !== id)
    return { success: true, id }
  },

  updateCourseStatus: async (id, status) => {
    await delay(200)
    courses = courses.map((c) =>
      c.id === id ? { ...c, status, updatedAt: new Date().toISOString().split('T')[0] } : c
    )
    return courses.find((c) => c.id === id)
  },
}
