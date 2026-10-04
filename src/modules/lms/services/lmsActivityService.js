// src/modules/lms/services/lmsActivityService.js
import { INITIAL_LMS_ACTIVITIES } from '../data/lmsMockData'

let activities = [...INITIAL_LMS_ACTIVITIES]

const delay = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsActivityService = {
  getActivities: async (filters = {}) => {
    await delay(60)
    let result = [...activities]
    if (filters.courseId) {
      result = result.filter((a) => a.courseId === filters.courseId)
    }
    if (filters.type) {
      result = result.filter((a) => a.type === filters.type)
    }
    return result
  },

  logActivity: async (data) => {
    await delay(30)
    const newActivity = {
      id: `act-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      ...data,
    }
    activities = [newActivity, ...activities]
    return newActivity
  },
}
