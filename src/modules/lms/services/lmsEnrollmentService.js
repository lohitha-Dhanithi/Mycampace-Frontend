// src/modules/lms/services/lmsEnrollmentService.js
import { INITIAL_LMS_ENROLLMENTS, INITIAL_LMS_COURSES } from '../data/lmsMockData'
import { lmsActivityService } from './lmsActivityService'

let enrollments = [...INITIAL_LMS_ENROLLMENTS]

const delay = (ms = 70) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsEnrollmentService = {
  getEnrollments: async (courseId) => {
    await delay(70)
    return enrollments.filter((e) => e.courseId === courseId)
  },

  getAllEnrollments: async () => {
    await delay(70)
    return [...enrollments]
  },

  enrollStudent: async (courseId, student) => {
    await delay(100)
    const existing = enrollments.find((e) => e.courseId === courseId && e.studentId === student.id)
    if (existing) {
      throw new Error('Student is already enrolled in this course')
    }

    const newEnr = {
      id: `enr-lms-${Date.now().toString().slice(-4)}`,
      courseId,
      studentId: student.id,
      studentName: student.personal?.fullName || student.name || 'Student',
      studentAdmissionNo: student.admissionNumber || student.studentId || 'ADM-000',
      studentEmail: student.contact?.email || `${student.id}@student.mycampace.edu.in`,
      className: student.academic?.className || 'Class 12',
      sectionName: student.academic?.sectionName || 'Section A',
      enrolledAt: new Date().toISOString().split('T')[0],
      progressPercentage: 0,
      status: 'Active',
      lastActivity: 'Never',
      completedLessonsCount: 0,
      totalLessonsCount: 7,
      assignmentsSubmitted: 0,
      quizzesCompleted: 0,
      averageScore: 0,
    }

    enrollments = [newEnr, ...enrollments]

    await lmsActivityService.logActivity({
      courseId,
      type: 'student_enrolled',
      title: 'Student Enrolled',
      description: `${newEnr.studentName} enrolled in course.`,
      actorName: 'Admin / Faculty',
      actorRole: 'Instructor',
    })

    return newEnr
  },

  bulkEnrollSection: async (courseId, sectionName, students = []) => {
    await delay(150)
    const added = []
    for (const s of students) {
      const exists = enrollments.some((e) => e.courseId === courseId && e.studentId === s.id)
      if (!exists) {
        const item = {
          id: `enr-lms-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`,
          courseId,
          studentId: s.id,
          studentName: s.personal?.fullName || s.name || 'Student',
          studentAdmissionNo: s.admissionNumber || s.studentId || 'ADM-000',
          studentEmail: s.contact?.email || `${s.id}@student.mycampace.edu.in`,
          className: s.academic?.className || 'Class 12',
          sectionName: sectionName || s.academic?.sectionName || 'Section A',
          enrolledAt: new Date().toISOString().split('T')[0],
          progressPercentage: 0,
          status: 'Active',
          lastActivity: 'Enrolled today',
          completedLessonsCount: 0,
          totalLessonsCount: 7,
          assignmentsSubmitted: 0,
          quizzesCompleted: 0,
          averageScore: 0,
        }
        added.push(item)
      }
    }

    enrollments = [...added, ...enrollments]

    await lmsActivityService.logActivity({
      courseId,
      type: 'student_enrolled',
      title: 'Bulk Cohort Enrollment',
      description: `${added.length} students from ${sectionName} enrolled.`,
      actorName: 'System Sync',
      actorRole: 'Auto-Sync',
    })

    return added
  },

  removeStudent: async (courseId, studentId) => {
    await delay(90)
    const enr = enrollments.find((e) => e.courseId === courseId && e.studentId === studentId)
    enrollments = enrollments.filter((e) => !(e.courseId === courseId && e.studentId === studentId))

    if (enr) {
      await lmsActivityService.logActivity({
        courseId,
        type: 'student_removed',
        title: 'Student Unenrolled',
        description: `${enr.studentName} was removed from the course roster.`,
        actorName: 'Faculty',
        actorRole: 'Instructor',
      })
    }
    return true
  },

  getMyEnrolledCourses: async (studentId = 'std-001') => {
    await delay(100)
    const myEnrs = enrollments.filter((e) => e.studentId === studentId)
    return myEnrs.map((enr) => {
      const course = INITIAL_LMS_COURSES.find((c) => c.id === enr.courseId) || {}
      return {
        ...course,
        enrollmentId: enr.id,
        progressPercentage: enr.progressPercentage,
        completedLessonsCount: enr.completedLessonsCount,
        totalLessonsCount: enr.totalLessonsCount,
        lastActivity: enr.lastActivity,
        averageScore: enr.averageScore,
        currentLesson: '1.2 Electric Field Lines, Dipoles & Torque Dynamics',
        nextActivity: 'Problem Set 1 due soon',
      }
    })
  },
}
