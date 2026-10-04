// src/modules/lms/services/lmsDiscussionService.js
import { INITIAL_LMS_DISCUSSIONS } from '../data/lmsMockData'

let discussions = [...INITIAL_LMS_DISCUSSIONS]

const delay = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsDiscussionService = {
  getDiscussions: async (courseId) => {
    await delay(60)
    if (!courseId) return [...discussions]
    return discussions
      .filter((d) => d.courseId === courseId)
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
  },

  getDiscussionById: async (id) => {
    await delay(50)
    return discussions.find((d) => d.id === id) || null
  },

  createDiscussion: async (data) => {
    await delay(100)
    const newDisc = {
      id: `dsc-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      isPinned: false,
      isClosed: false,
      replies: [],
      ...data,
    }
    discussions = [newDisc, ...discussions]
    return newDisc
  },

  addReply: async (discussionId, replyData) => {
    await delay(90)
    const disc = discussions.find((d) => d.id === discussionId)
    if (!disc) throw new Error('Discussion thread not found')

    const newReply = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      ...replyData,
    }
    disc.replies = [...(disc.replies || []), newReply]
    return newReply
  },

  togglePinDiscussion: async (id) => {
    await delay(60)
    const disc = discussions.find((d) => d.id === id)
    if (disc) {
      disc.isPinned = !disc.isPinned
    }
    return disc
  },

  closeDiscussion: async (id) => {
    await delay(60)
    const disc = discussions.find((d) => d.id === id)
    if (disc) {
      disc.isClosed = true
    }
    return disc
  },
}
