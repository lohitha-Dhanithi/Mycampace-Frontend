// src/modules/lms/services/lmsModuleService.js
import { INITIAL_LMS_MODULES } from '../data/lmsMockData'
import { lmsActivityService } from './lmsActivityService'

let modules = [...INITIAL_LMS_MODULES]

const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsModuleService = {
  getModules: async (courseId) => {
    await delay(80)
    let result = modules.filter((m) => m.courseId === courseId)
    return result.sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
  },

  getModuleById: async (id) => {
    await delay(60)
    return modules.find((m) => m.id === id) || null
  },

  createModule: async (courseId, data) => {
    await delay(120)
    const existing = modules.filter((m) => m.courseId === courseId)
    const newModule = {
      id: `mod-${Date.now().toString().slice(-4)}`,
      courseId,
      sequence: existing.length + 1,
      lessonCount: 0,
      assignmentCount: 0,
      quizCount: 0,
      status: 'Published',
      ...data,
    }
    modules = [...modules, newModule]

    await lmsActivityService.logActivity({
      courseId,
      type: 'module_created',
      title: 'Module Created',
      description: `New module "${newModule.name}" added to curriculum.`,
      actorName: 'Faculty',
      actorRole: 'Instructor',
    })

    return newModule
  },

  updateModule: async (id, updates) => {
    await delay(100)
    const index = modules.findIndex((m) => m.id === id)
    if (index === -1) throw new Error('Module not found')
    modules[index] = { ...modules[index], ...updates }
    return modules[index]
  },

  deleteModule: async (id) => {
    await delay(100)
    modules = modules.filter((m) => m.id !== id)
    return true
  },

  reorderModules: async (courseId, orderedIds) => {
    await delay(100)
    modules = modules.map((m) => {
      if (m.courseId === courseId) {
        const newSeq = orderedIds.indexOf(m.id)
        if (newSeq !== -1) {
          return { ...m, sequence: newSeq + 1 }
        }
      }
      return m
    })
    return modules.filter((m) => m.courseId === courseId).sort((a, b) => a.sequence - b.sequence)
  },

  togglePublishModule: async (id) => {
    await delay(80)
    const index = modules.findIndex((m) => m.id === id)
    if (index === -1) throw new Error('Module not found')
    modules[index].status = modules[index].status === 'Published' ? 'Draft' : 'Published'
    return modules[index]
  },
}
