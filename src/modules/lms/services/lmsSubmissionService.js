// src/modules/lms/services/lmsSubmissionService.js
import { INITIAL_LMS_SUBMISSIONS } from '../data/lmsMockData'
import { lmsActivityService } from './lmsActivityService'

let submissions = [...INITIAL_LMS_SUBMISSIONS]

const delay = (ms = 70) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsSubmissionService = {
  getSubmissions: async (assignmentId) => {
    await delay(70)
    if (!assignmentId) return [...submissions]
    return submissions.filter((s) => s.assignmentId === assignmentId)
  },

  getAllSubmissions: async () => {
    await delay(70)
    return [...submissions]
  },

  getSubmissionById: async (id) => {
    await delay(50)
    return submissions.find((s) => s.id === id) || null
  },

  getStudentSubmission: async (assignmentId, studentId = 'std-001') => {
    await delay(50)
    return submissions.find((s) => s.assignmentId === assignmentId && s.studentId === studentId) || null
  },

  submitAssignment: async (data) => {
    await delay(120)
    const existingIndex = submissions.findIndex(
      (s) => s.assignmentId === data.assignmentId && s.studentId === data.studentId
    )

    const isLate = data.dueDate ? new Date() > new Date(data.dueDate) : false

    const newSub = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      submittedAt: new Date().toISOString(),
      status: isLate ? 'Late' : 'Submitted',
      isLate,
      attemptNumber: 1,
      marks: null,
      feedback: null,
      graderId: null,
      graderName: null,
      gradedAt: null,
      ...data,
    }

    if (existingIndex !== -1) {
      newSub.attemptNumber = (submissions[existingIndex].attemptNumber || 1) + 1
      submissions[existingIndex] = newSub
    } else {
      submissions = [newSub, ...submissions]
    }

    await lmsActivityService.logActivity({
      courseId: data.courseId,
      type: 'assignment_submitted',
      title: 'Assignment Submitted',
      description: `${data.studentName || 'Student'} submitted ${data.assignmentTitle || 'assignment'}.`,
      actorName: data.studentName || 'Student',
      actorRole: 'Student',
    })

    return newSub
  },

  gradeAssignment: async (submissionId, gradeData) => {
    await delay(120)
    const index = submissions.findIndex((s) => s.id === submissionId)
    if (index === -1) throw new Error('Submission not found')

    submissions[index] = {
      ...submissions[index],
      marks: Number(gradeData.marks),
      feedback: gradeData.feedback || '',
      graderId: gradeData.graderId || 'usr-5',
      graderName: gradeData.graderName || 'Instructor',
      gradedAt: new Date().toISOString(),
      status: 'Graded',
    }

    await lmsActivityService.logActivity({
      courseId: submissions[index].courseId,
      type: 'assignment_graded',
      title: 'Assignment Graded',
      description: `Graded ${submissions[index].studentName}'s submission (${gradeData.marks}/${submissions[index].maxMarks}).`,
      actorName: gradeData.graderName || 'Instructor',
      actorRole: 'Instructor',
    })

    return submissions[index]
  },

  returnSubmission: async (submissionId, returnNotes) => {
    await delay(80)
    const index = submissions.findIndex((s) => s.id === submissionId)
    if (index === -1) throw new Error('Submission not found')

    submissions[index].status = 'Returned'
    submissions[index].feedback = returnNotes || 'Returned for revisions by instructor.'
    return submissions[index]
  },

  reopenSubmission: async (submissionId) => {
    await delay(80)
    const index = submissions.findIndex((s) => s.id === submissionId)
    if (index === -1) throw new Error('Submission not found')

    submissions[index].status = 'Draft'
    submissions[index].marks = null
    submissions[index].feedback = 'Submission reopened for resubmission.'
    return submissions[index]
  },
}
