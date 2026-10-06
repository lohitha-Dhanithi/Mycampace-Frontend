// src/modules/academicConfiguration/services/curriculumService.js
import { MOCK_CURRICULUM } from '../data/curriculumMockData'

let curriculums = [...MOCK_CURRICULUM]
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const curriculumService = {
  getCurriculum: async (filters: any = {}) => {
    await delay()
    let result = [...curriculums]
    if (filters.academicYearId) {
      result = result.filter((c) => c.academicYearId === filters.academicYearId)
    }
    if (filters.programId) {
      result = result.filter((c) => c.programId === filters.programId)
    }
    return result
  },

  getCurriculumById: async (id) => {
    await delay()
    return curriculums.find((c) => c.id === id) || null
  },

  createCurriculum: async (data) => {
    await delay(250)
    const newRecord = {
      id: `curr-${Date.now()}`,
      institutionId: 'inst-001',
      campusId: 'camp-001',
      status: 'Active',
      totalCredits: 0,
      totalSubjects: 0,
      semesters: [
        { semester: 1, title: 'Semester 1', subjects: [] },
        { semester: 2, title: 'Semester 2', subjects: [] },
      ],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    }
    curriculums = [newRecord, ...curriculums]
    return newRecord
  },

  updateCurriculum: async (id, data) => {
    await delay(250)
    curriculums = curriculums.map((c) =>
      c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString().split('T')[0] } : c
    )
    return curriculums.find((c) => c.id === id)
  },

  assignSubjectToCurriculum: async (curriculumId, semesterNumber, subject) => {
    await delay(200)
    const curr = curriculums.find((c) => c.id === curriculumId)
    if (!curr) throw new Error('Curriculum not found')

    const sem = curr.semesters.find((s) => s.semester === semesterNumber)
    if (!sem) throw new Error('Semester not found')

    // Prevent duplicate assignment in the same semester
    if (sem.subjects.some((s) => s.subjectId === subject.id)) {
      throw new Error('This subject is already assigned to this semester.')
    }

    const newSubjItem = {
      subjectId: subject.id,
      name: subject.name,
      code: subject.code,
      type: subject.type,
      credits: subject.credits || 3,
      lectureHours: subject.lectureHours || 3,
      labHours: subject.labHours || 0,
    }

    sem.subjects.push(newSubjItem)

    // Recalculate totals
    let totalSubs = 0
    let totalCreds = 0
    curr.semesters.forEach((s) => {
      totalSubs += s.subjects.length
      totalCreds += s.subjects.reduce((sum, item) => sum + (item.credits || 0), 0)
    })
    curr.totalSubjects = totalSubs
    curr.totalCredits = totalCreds
    curr.updatedAt = new Date().toISOString().split('T')[0]

    return curr
  },

  removeSubjectFromCurriculum: async (curriculumId, semesterNumber, subjectId) => {
    await delay(200)
    const curr = curriculums.find((c) => c.id === curriculumId)
    if (!curr) throw new Error('Curriculum not found')

    const sem = curr.semesters.find((s) => s.semester === semesterNumber)
    if (!sem) throw new Error('Semester not found')

    sem.subjects = sem.subjects.filter((s) => s.subjectId !== subjectId)

    // Recalculate totals
    let totalSubs = 0
    let totalCreds = 0
    curr.semesters.forEach((s) => {
      totalSubs += s.subjects.length
      totalCreds += s.subjects.reduce((sum, item) => sum + (item.credits || 0), 0)
    })
    curr.totalSubjects = totalSubs
    curr.totalCredits = totalCreds
    curr.updatedAt = new Date().toISOString().split('T')[0]

    return curr
  },
}
