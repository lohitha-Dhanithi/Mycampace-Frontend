// src/modules/lms/services/lmsProgressService.js
import { lmsActivityService } from './lmsActivityService'

// In-memory student lesson completions map: `${courseId}_${studentId}_${lessonId}` -> true
const completedLessonsMap = new Map([
  ['lms-crs-101_std-001_les-101', { completedAt: '2026-09-15 10:30', timeSpent: '42 mins' }],
  ['lms-crs-101_std-001_les-102', { completedAt: '2026-09-17 11:20', timeSpent: '35 mins' }],
  ['lms-crs-101_std-001_les-103', { completedAt: '2026-09-18 14:10', timeSpent: '50 mins' }],
  ['lms-crs-101_std-001_les-104', { completedAt: '2026-09-22 09:40', timeSpent: '38 mins' }],
  ['lms-crs-101_std-001_les-105', { completedAt: '2026-09-24 16:15', timeSpent: '45 mins' }],
  ['lms-crs-101_std-001_les-106', { completedAt: '2026-09-27 15:30', timeSpent: '30 mins' }],

  ['lms-crs-101_std-002_les-101', { completedAt: '2026-09-16 10:00', timeSpent: '40 mins' }],
  ['lms-crs-101_std-002_les-102', { completedAt: '2026-09-18 12:00', timeSpent: '35 mins' }],
  ['lms-crs-101_std-002_les-103', { completedAt: '2026-09-20 15:00', timeSpent: '45 mins' }],
  ['lms-crs-101_std-002_les-104', { completedAt: '2026-09-25 11:00', timeSpent: '38 mins' }],
  ['lms-crs-101_std-002_les-105', { completedAt: '2026-09-28 14:00', timeSpent: '40 mins' }],
])

const delay = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsProgressService = {
  getStudentCourseProgress: async (courseId, studentId = 'std-001') => {
    await delay(60)
    // Gather all completed lessons for this student & course
    const completedLessonIds = []
    for (const [key, value] of completedLessonsMap.entries()) {
      if (key.startsWith(`${courseId}_${studentId}_`)) {
        const lessonId = key.split('_')[2]
        completedLessonIds.push({ lessonId, ...value })
      }
    }

    return {
      courseId,
      studentId,
      completedLessonIds,
      totalCompletedLessons: completedLessonIds.length,
      timeSpentHours: (completedLessonIds.length * 0.7).toFixed(1),
      lastAccessed: 'Today at 3:15 PM',
    }
  },

  isLessonCompleted: async (courseId, studentId, lessonId) => {
    return completedLessonsMap.has(`${courseId}_${studentId}_${lessonId}`)
  },

  markLessonComplete: async (courseId, studentId, lessonId, lessonTitle = 'Lesson') => {
    await delay(70)
    const key = `${courseId}_${studentId}_${lessonId}`
    completedLessonsMap.set(key, {
      completedAt: new Date().toISOString(),
      timeSpent: '35 mins',
    })

    await lmsActivityService.logActivity({
      courseId,
      type: 'lesson_completed',
      title: 'Lesson Completed',
      description: `Completed lesson "${lessonTitle}"`,
      actorName: 'Student',
      actorRole: 'Student',
    })

    return { success: true, key }
  },

  getStudentLearningTimeline: async (courseId, studentId = 'std-001') => {
    await delay(60)
    return [
      {
        id: 'tl-1',
        time: 'Today, 2:30 PM',
        type: 'lesson',
        title: 'Completed Lesson 3.1: Electric Currents & Drift Velocity',
        badge: 'Completed',
        badgeColor: 'bg-emerald-100 text-emerald-800',
      },
      {
        id: 'tl-2',
        time: 'Yesterday, 4:15 PM',
        type: 'assignment',
        title: 'Submitted Problem Set 1: Gauss Law Computations',
        badge: 'Graded (28/30)',
        badgeColor: 'bg-blue-100 text-blue-800',
      },
      {
        id: 'tl-3',
        time: '3 days ago',
        type: 'quiz',
        title: 'Scored 100% on Diagnostic Quiz: Electric Charges & Gauss Law',
        badge: 'Passed',
        badgeColor: 'bg-purple-100 text-purple-800',
      },
      {
        id: 'tl-4',
        time: '5 days ago',
        type: 'lesson',
        title: 'Opened PDF notes for 1.3 Gauss Theorem Applications',
        badge: 'Study Material',
        badgeColor: 'bg-slate-100 text-slate-700',
      },
      {
        id: 'tl-5',
        time: '2026-09-15',
        type: 'enrolment',
        title: 'Enrolled in Advanced Physics: Electromagnetism & Wave Optics',
        badge: 'Enrolled',
        badgeColor: 'bg-amber-100 text-amber-800',
      },
    ]
  },

  getCourseProgressOverview: async (courseId) => {
    await delay(70)
    return {
      totalStudents: 38,
      averageCompletion: 68,
      completedStudents: 5,
      inProgressStudents: 31,
      notStartedStudents: 2,
      averageAssessmentScore: 82.5,
      submissionRate: 91,
      quizParticipation: 88,
    }
  },
}
