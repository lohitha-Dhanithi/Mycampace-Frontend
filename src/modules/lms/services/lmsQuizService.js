// src/modules/lms/services/lmsQuizService.js
import { INITIAL_LMS_QUIZZES, INITIAL_LMS_ATTEMPTS } from '../data/lmsMockData'
import { lmsActivityService } from './lmsActivityService'

let quizzes = [...INITIAL_LMS_QUIZZES]
let attempts = [...INITIAL_LMS_ATTEMPTS]

const delay = (ms = 70) => new Promise((resolve) => setTimeout(resolve, ms))

export const lmsQuizService = {
  getQuizzes: async (courseId) => {
    await delay(70)
    if (!courseId) return [...quizzes]
    return quizzes.filter((q) => q.courseId === courseId)
  },

  getAllQuizzes: async (filters = {}) => {
    await delay(80)
    let result = [...quizzes]
    if (filters.courseId && filters.courseId !== 'all') {
      result = result.filter((q) => q.courseId === filters.courseId)
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((q) => q.status.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (quiz) => quiz.name.toLowerCase().includes(q) || quiz.description.toLowerCase().includes(q)
      )
    }
    return result
  },

  getQuizById: async (id) => {
    await delay(60)
    return quizzes.find((q) => q.id === id) || null
  },

  createQuiz: async (data) => {
    await delay(120)
    const newQuiz = {
      id: `quiz-${Date.now().toString().slice(-4)}`,
      status: 'Published',
      totalQuestions: data.questions?.length || 0,
      totalMarks: data.questions?.reduce((acc, q) => acc + (q.marks || 0), 0) || 20,
      questions: data.questions || [],
      ...data,
    }
    quizzes = [newQuiz, ...quizzes]

    await lmsActivityService.logActivity({
      courseId: newQuiz.courseId,
      type: 'quiz_created',
      title: 'Quiz Created',
      description: `New quiz "${newQuiz.name}" published.`,
      actorName: 'Faculty',
      actorRole: 'Instructor',
    })

    return newQuiz
  },

  updateQuiz: async (id, updates) => {
    await delay(90)
    const index = quizzes.findIndex((q) => q.id === id)
    if (index === -1) throw new Error('Quiz not found')
    quizzes[index] = { ...quizzes[index], ...updates }
    return quizzes[index]
  },

  deleteQuiz: async (id) => {
    await delay(90)
    quizzes = quizzes.filter((q) => q.id !== id)
    return true
  },

  addQuestion: async (quizId, questionData) => {
    await delay(80)
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) throw new Error('Quiz not found')

    const newQ = {
      id: `q-${Date.now().toString().slice(-4)}`,
      isRequired: true,
      marks: 4,
      ...questionData,
    }
    quiz.questions = [...(quiz.questions || []), newQ]
    quiz.totalQuestions = quiz.questions.length
    quiz.totalMarks = quiz.questions.reduce((sum, q) => sum + (q.marks || 0), 0)
    return quiz
  },

  updateQuestion: async (quizId, questionId, updates) => {
    await delay(80)
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) throw new Error('Quiz not found')

    quiz.questions = quiz.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    quiz.totalMarks = quiz.questions.reduce((sum, q) => sum + (q.marks || 0), 0)
    return quiz
  },

  deleteQuestion: async (quizId, questionId) => {
    await delay(70)
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) throw new Error('Quiz not found')

    quiz.questions = quiz.questions.filter((q) => q.id !== questionId)
    quiz.totalQuestions = quiz.questions.length
    quiz.totalMarks = quiz.questions.reduce((sum, q) => sum + (q.marks || 0), 0)
    return quiz
  },

  getQuizAttempts: async (quizId) => {
    await delay(70)
    if (!quizId) return [...attempts]
    return attempts.filter((a) => a.quizId === quizId)
  },

  submitQuizAttempt: async (quizId, studentData, answers) => {
    await delay(120)
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) throw new Error('Quiz not found')

    // Grade attempt automatically
    let calculatedScore = 0
    let totalPossible = quiz.totalMarks || 20

    if (quiz.questions && quiz.questions.length > 0) {
      quiz.questions.forEach((q) => {
        const studentAns = answers[q.id]
        if (!studentAns) return

        if (q.type === 'multiple_choice' || q.type === 'true_false') {
          const correctOpt = q.options?.find((o) => o.isCorrect)
          if (correctOpt && correctOpt.id === studentAns) {
            calculatedScore += q.marks || 4
          }
        } else if (q.type === 'multiple_select') {
          const correctIds = q.options?.filter((o) => o.isCorrect).map((o) => o.id) || []
          if (Array.isArray(studentAns)) {
            const matches = studentAns.every((id) => correctIds.includes(id)) && studentAns.length === correctIds.length
            if (matches) {
              calculatedScore += q.marks || 4
            }
          }
        } else if (q.type === 'short_answer') {
          const accepted = q.correctAnswers?.map((a) => a.toLowerCase().trim()) || []
          if (typeof studentAns === 'string' && accepted.includes(studentAns.toLowerCase().trim())) {
            calculatedScore += q.marks || 4
          }
        }
      })
    } else {
      calculatedScore = totalPossible
    }

    const percentage = totalPossible > 0 ? Math.round((calculatedScore / totalPossible) * 100) : 100
    const isPassed = percentage >= (quiz.passingScore || 70)

    const existingAttempts = attempts.filter((a) => a.quizId === quizId && a.studentId === studentData.id)
    const attemptNumber = existingAttempts.length + 1

    const newAttempt = {
      id: `att-${Date.now().toString().slice(-4)}`,
      quizId,
      courseId: quiz.courseId,
      studentId: studentData.id,
      studentName: studentData.personal?.fullName || studentData.name || 'Student',
      attemptNumber,
      startedAt: new Date(Date.now() - (quiz.duration || 20) * 60000).toISOString(),
      completedAt: new Date().toISOString(),
      score: calculatedScore,
      totalMarks: totalPossible,
      percentage,
      isPassed,
      answers,
    }

    attempts = [newAttempt, ...attempts]

    await lmsActivityService.logActivity({
      courseId: quiz.courseId,
      type: 'quiz_completed',
      title: 'Quiz Completed',
      description: `${newAttempt.studentName} completed ${quiz.name} with ${percentage}% (${isPassed ? 'Passed' : 'Failed'}).`,
      actorName: newAttempt.studentName,
      actorRole: 'Student',
    })

    return newAttempt
  },
}
