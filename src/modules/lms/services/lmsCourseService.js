// src/modules/lms/services/lmsCourseService.js
import { INITIAL_LMS_COURSES, INITIAL_LMS_MODULES, INITIAL_LMS_LESSONS, INITIAL_LMS_ASSIGNMENTS, INITIAL_LMS_QUIZZES, INITIAL_LMS_ENROLLMENTS } from '../data/lmsMockData'
import { lmsActivityService } from './lmsActivityService'

let courses = [...INITIAL_LMS_COURSES]

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsCourseService = {
  getCourses: async (filters = {}) => {
    await delay(100)
    let result = [...courses]

    if (filters.campusId && filters.campusId !== 'all') {
      result = result.filter((c) => c.campusId === filters.campusId)
    }
    if (filters.academicYearId && filters.academicYearId !== 'all') {
      result = result.filter((c) => c.academicYearId === filters.academicYearId)
    }
    if (filters.programId && filters.programId !== 'all') {
      result = result.filter((c) => c.programId === filters.programId)
    }
    if (filters.classId && filters.classId !== 'all') {
      result = result.filter((c) => c.classId === filters.classId)
    }
    if (filters.sectionId && filters.sectionId !== 'all') {
      result = result.filter((c) => c.sectionId === filters.sectionId)
    }
    if (filters.instructorId && filters.instructorId !== 'all') {
      result = result.filter((c) => c.instructorId === filters.instructorId)
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((c) => c.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.courseCode?.toLowerCase().includes(q) ||
          c.subjectName?.toLowerCase().includes(q) ||
          c.instructorName?.toLowerCase().includes(q) ||
          c.className?.toLowerCase().includes(q) ||
          c.id?.toLowerCase().includes(q)
      )
    }

    return result
  },

  getCourseById: async (id) => {
    await delay(80)
    return courses.find((c) => c.id === id) || null
  },

  createCourse: async (data) => {
    await delay(150)
    const newCourse = {
      id: `lms-crs-${Date.now().toString().slice(-4)}`,
      status: 'Draft',
      studentCount: 0,
      modulesCount: 0,
      lessonsCount: 0,
      assignmentsCount: 0,
      quizzesCount: 0,
      completionRate: 0,
      averageScore: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      tags: data.tags || [],
      coInstructors: data.coInstructors || [],
      ...data,
    }
    courses = [newCourse, ...courses]

    await lmsActivityService.logActivity({
      courseId: newCourse.id,
      courseName: newCourse.name,
      type: 'course_created',
      title: 'Course Created',
      description: `New LMS course "${newCourse.name}" created as Draft.`,
      actorName: 'Admin / Faculty',
      actorRole: 'Instructor',
    })

    return newCourse
  },

  updateCourse: async (id, updates) => {
    await delay(120)
    const index = courses.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Course not found')

    const updated = {
      ...courses[index],
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    courses[index] = updated

    await lmsActivityService.logActivity({
      courseId: updated.id,
      courseName: updated.name,
      type: 'course_updated',
      title: 'Course Settings Updated',
      description: `Course "${updated.name}" metadata and settings updated.`,
      actorName: 'Admin / Faculty',
      actorRole: 'Instructor',
    })

    return updated
  },

  duplicateCourse: async (id) => {
    await delay(150)
    const source = courses.find((c) => c.id === id)
    if (!source) throw new Error('Course not found')

    const cloned = {
      ...source,
      id: `lms-crs-${Date.now().toString().slice(-4)}`,
      name: `${source.name} (Copy)`,
      courseCode: `${source.courseCode}-COPY`,
      status: 'Draft',
      studentCount: 0,
      completionRate: 0,
      averageScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    }
    courses = [cloned, ...courses]
    return cloned
  },

  validateCoursePublishReadiness: async (courseId) => {
    await delay(80)
    const course = courses.find((c) => c.id === courseId)
    if (!course) throw new Error('Course not found')

    const passedChecks = []
    const warnings = []
    const criticalIssues = []

    // 1. Basic Course Details
    if (course.name && course.courseCode && course.description) {
      passedChecks.push('Course information & metadata complete')
    } else {
      criticalIssues.push('Course name, code, or description is missing')
    }

    // 2. Academic Mapping
    if (course.academicYearId && course.programId && course.classId && course.subjectId) {
      passedChecks.push(`Academic mapping configured (${course.className} / ${course.sectionName || 'All Sections'} - ${course.subjectName})`)
    } else {
      criticalIssues.push('Academic year, class, or subject mapping is missing')
    }

    // 3. Faculty Instructor
    if (course.instructorId && course.instructorName) {
      passedChecks.push(`Lead instructor assigned (${course.instructorName})`)
    } else {
      criticalIssues.push('No lead faculty instructor assigned')
    }

    // 4. Module Check
    if (course.modulesCount > 0) {
      passedChecks.push(`At least one active module exists (${course.modulesCount} modules configured)`)
    } else {
      criticalIssues.push('Course must contain at least 1 module before publishing')
    }

    // 5. Lessons Check
    if (course.lessonsCount > 0) {
      passedChecks.push(`Lesson content configured (${course.lessonsCount} lessons)`)
    } else {
      criticalIssues.push('Course has no published lessons for students to learn')
    }

    // 6. Assessments
    if (course.assignmentsCount > 0 || course.quizzesCount > 0) {
      passedChecks.push(`Assessment configuration valid (${course.assignmentsCount} assignments, ${course.quizzesCount} quizzes)`)
    } else {
      warnings.push('No assignments or quizzes are configured in this course')
    }

    // 7. Enrolment
    if (course.enrollmentMode === 'Automatic') {
      passedChecks.push('Automatic cohort enrollment enabled for mapped section')
    } else if (course.studentCount > 0) {
      passedChecks.push(`${course.studentCount} students enrolled`)
    } else {
      warnings.push('Manual enrollment mode is selected but 0 students are enrolled')
    }

    return {
      courseId,
      courseName: course.name,
      isReady: criticalIssues.length === 0,
      passedChecks,
      warnings,
      criticalIssues,
    }
  },

  publishCourse: async (id) => {
    await delay(120)
    const index = courses.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Course not found')

    courses[index].status = 'Published'
    courses[index].lastUpdated = new Date().toISOString().split('T')[0]

    await lmsActivityService.logActivity({
      courseId: courses[index].id,
      courseName: courses[index].name,
      type: 'course_published',
      title: 'Course Published',
      description: `Course "${courses[index].name}" is now live and accessible to students.`,
      actorName: 'Admin / Faculty',
      actorRole: 'Instructor',
    })

    return courses[index]
  },

  archiveCourse: async (id) => {
    await delay(120)
    const index = courses.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Course not found')

    courses[index].status = 'Archived'
    courses[index].lastUpdated = new Date().toISOString().split('T')[0]

    await lmsActivityService.logActivity({
      courseId: courses[index].id,
      courseName: courses[index].name,
      type: 'course_archived',
      title: 'Course Archived',
      description: `Course "${courses[index].name}" has been moved to historical archives.`,
      actorName: 'Admin / Faculty',
      actorRole: 'Instructor',
    })

    return courses[index]
  },

  deleteCourse: async (id) => {
    await delay(120)
    const target = courses.find((c) => c.id === id)
    if (!target) throw new Error('Course not found')
    courses = courses.filter((c) => c.id !== id)
    return true
  },
}
