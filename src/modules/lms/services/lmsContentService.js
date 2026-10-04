// src/modules/lms/services/lmsContentService.js
import { INITIAL_CONTENT_LIBRARY } from '../data/lmsMockData'

let library = [...INITIAL_CONTENT_LIBRARY]

const delay = (ms = 70) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsContentService = {
  getContentItems: async (filters = {}) => {
    await delay(80)
    let result = [...library]

    if (filters.type && filters.type !== 'all') {
      result = result.filter((item) => item.type.toLowerCase() === filters.type.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (item) =>
          item.fileName.toLowerCase().includes(q) ||
          item.uploadedBy.toLowerCase().includes(q) ||
          item.usedInCourses?.some((c) => c.toLowerCase().includes(q))
      )
    }

    return result
  },

  getContentById: async (id) => {
    await delay(50)
    return library.find((item) => item.id === id) || null
  },

  uploadContentItem: async (data) => {
    await delay(150)
    const newItem = {
      id: `lib-${Date.now().toString().slice(-4)}`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      usedInCourses: [],
      ...data,
    }
    library = [newItem, ...library]
    return newItem
  },

  deleteContentItem: async (id) => {
    await delay(100)
    const item = library.find((i) => i.id === id)
    if (!item) throw new Error('Resource not found')

    if (item.usedInCourses && item.usedInCourses.length > 0) {
      throw new Error(`Cannot delete this resource because it is currently linked to: ${item.usedInCourses.join(', ')}`)
    }

    library = library.filter((i) => i.id !== id)
    return true
  },

  linkContentToCourse: async (contentId, courseName) => {
    await delay(80)
    const index = library.findIndex((i) => i.id === contentId)
    if (index !== -1) {
      const current = library[index].usedInCourses || []
      if (!current.includes(courseName)) {
        library[index].usedInCourses = [...current, courseName]
      }
    }
    return library[index]
  },
}
