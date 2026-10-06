// src/modules/lms/services/lmsAnnouncementService.js
import { INITIAL_LMS_ANNOUNCEMENTS } from '../data/lmsMockData'
import { lmsActivityService } from './lmsActivityService'

let announcements = [...INITIAL_LMS_ANNOUNCEMENTS]

const delay = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsAnnouncementService = {
  getAnnouncements: async (courseId) => {
    await delay(60)
    if (!courseId) return [...announcements]
    return announcements.filter((a) => a.courseId === courseId)
  },

  createAnnouncement: async (data) => {
    await delay(100)
    const newAnc = {
      id: `anc-${Date.now().toString().slice(-4)}`,
      publishedDate: new Date().toISOString(),
      priority: data.priority || 'Normal',
      audience: 'All Enrolled Students',
      ...data,
    }
    announcements = [newAnc, ...announcements]

    await lmsActivityService.logActivity({
      courseId: newAnc.courseId,
      type: 'announcement_published',
      title: 'Announcement Published',
      description: `New announcement: "${newAnc.title}".`,
      actorName: newAnc.authorName || 'Instructor',
      actorRole: 'Instructor',
    })

    return newAnc
  },

  deleteAnnouncement: async (id) => {
    await delay(70)
    announcements = announcements.filter((a) => a.id !== id)
    return true
  },
}
