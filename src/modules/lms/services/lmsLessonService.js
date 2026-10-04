// src/modules/lms/services/lmsLessonService.js
import { INITIAL_LMS_LESSONS } from '../data/lmsMockData'
import { lmsActivityService } from './lmsActivityService'

let lessons = [...INITIAL_LMS_LESSONS]

const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsLessonService = {
  getLessons: async (moduleId) => {
    await delay(70)
    return lessons
      .filter((l) => l.moduleId === moduleId)
      .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
  },

  getLessonsByCourse: async (courseId) => {
    await delay(80)
    return lessons
      .filter((l) => l.courseId === courseId)
      .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
  },

  getLessonById: async (id) => {
    await delay(50)
    return lessons.find((l) => l.id === id) || null
  },

  createLesson: async (moduleId, data) => {
    await delay(120)
    const existing = lessons.filter((l) => l.moduleId === moduleId)
    const newLesson = {
      id: `les-${Date.now().toString().slice(-4)}`,
      moduleId,
      sequence: existing.length + 1,
      status: 'Published',
      isMandatory: true,
      duration: data.duration || '30 mins',
      contentType: data.contentType || 'Text',
      ...data,
    }
    lessons = [...lessons, newLesson]

    await lmsActivityService.logActivity({
      courseId: newLesson.courseId,
      type: 'lesson_published',
      title: 'Lesson Published',
      description: `Lesson "${newLesson.title}" (${newLesson.contentType}) published.`,
      actorName: 'Faculty',
      actorRole: 'Instructor',
    })

    return newLesson
  },

  updateLesson: async (id, updates) => {
    await delay(90)
    const index = lessons.findIndex((l) => l.id === id)
    if (index === -1) throw new Error('Lesson not found')
    lessons[index] = { ...lessons[index], ...updates }
    return lessons[index]
  },

  deleteLesson: async (id) => {
    await delay(90)
    lessons = lessons.filter((l) => l.id !== id)
    return true
  },

  publishLesson: async (id) => {
    await delay(80)
    const index = lessons.findIndex((l) => l.id === id)
    if (index === -1) throw new Error('Lesson not found')
    lessons[index].status = 'Published'
    return lessons[index]
  },

  reorderLessons: async (moduleId, orderedIds) => {
    await delay(80)
    lessons = lessons.map((l) => {
      if (l.moduleId === moduleId) {
        const idx = orderedIds.indexOf(l.id)
        if (idx !== -1) {
          return { ...l, sequence: idx + 1 }
        }
      }
      return l
    })
    return lessons.filter((l) => l.moduleId === moduleId).sort((a, b) => a.sequence - b.sequence)
  },
}
