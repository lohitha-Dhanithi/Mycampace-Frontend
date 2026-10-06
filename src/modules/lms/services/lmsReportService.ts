// src/modules/lms/services/lmsReportService.js
import { INITIAL_LMS_COURSES, INITIAL_LMS_ENROLLMENTS, INITIAL_LMS_ASSIGNMENTS, INITIAL_LMS_QUIZZES } from '../data/lmsMockData'

const delay = (ms = 80) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsReportService = {
  getCourseProgressReports: async (filters: any = {}) => {
    await delay(90)
    let list = INITIAL_LMS_COURSES.map((c) => ({
      courseId: c.id,
      courseCode: c.courseCode,
      courseName: c.name,
      subjectName: c.subjectName,
      className: c.className,
      sectionName: c.sectionName,
      instructorName: c.instructorName,
      totalStudents: c.studentCount,
      activeStudents: Math.max(0, c.studentCount - 2),
      completionRate: c.completionRate,
      averageScore: c.averageScore,
      status: c.status,
    }))

    if (filters.campusId && filters.campusId !== 'all') {
      // simulate campus filter
    }
    return list
  },

  getStudentProgressReports: async (filters: any = {}) => {
    await delay(90)
    return INITIAL_LMS_ENROLLMENTS.map((e) => ({
      studentId: e.studentId,
      studentName: e.studentName,
      admissionNo: e.studentAdmissionNo,
      courseName: 'Advanced Physics: Electromagnetism & Wave Optics',
      className: e.className,
      sectionName: e.sectionName,
      completionRate: e.progressPercentage,
      assignmentsCompleted: `${e.assignmentsSubmitted} / 2`,
      quizzesCompleted: `${e.quizzesCompleted} / 2`,
      averageScore: `${e.averageScore}%`,
      lastActivity: e.lastActivity,
      status: e.status,
    }))
  },

  getAssessmentReports: async (filters: any = {}) => {
    await delay(90)
    const assignmentReports = INITIAL_LMS_ASSIGNMENTS.map((a) => ({
      id: a.id,
      name: a.title,
      type: 'Assignment',
      courseName: 'Advanced Physics: Electromagnetism & Wave Optics',
      maxMarks: a.maxMarks,
      attempts: a.submissionCount,
      gradedCount: a.gradedCount,
      averageScore: `${a.averageScore || 0} / ${a.maxMarks}`,
      passRate: '94%',
      highestScore: a.maxMarks - 1,
      lowestScore: Math.round(a.maxMarks * 0.55),
    }))

    const quizReports = INITIAL_LMS_QUIZZES.map((q) => ({
      id: q.id,
      name: q.name,
      type: 'Quiz',
      courseName: 'Advanced Physics: Electromagnetism & Wave Optics',
      maxMarks: q.totalMarks,
      attempts: 24,
      gradedCount: 24,
      averageScore: '16.8 / 20',
      passRate: '87%',
      highestScore: q.totalMarks,
      lowestScore: 8,
    }))

    return [...assignmentReports, ...quizReports]
  },
}
