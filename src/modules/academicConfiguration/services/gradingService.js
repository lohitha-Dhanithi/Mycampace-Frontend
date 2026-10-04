// src/modules/academicConfiguration/services/gradingService.js
import { MOCK_GRADING_SYSTEM } from '../data/gradingMockData'

let gradingSystem = JSON.parse(JSON.stringify(MOCK_GRADING_SYSTEM))
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const gradingService = {
  getGradingConfiguration: async () => {
    await delay()
    return JSON.parse(JSON.stringify(gradingSystem))
  },

  updateGradingConfiguration: async (data) => {
    await delay(250)
    gradingSystem = {
      ...gradingSystem,
      ...data,
      updatedAt: new Date().toISOString().split('T')[0],
    }
    return JSON.parse(JSON.stringify(gradingSystem))
  },

  addGrade: async (gradeData) => {
    await delay(250)
    const newGrade = {
      id: `grd-${Date.now()}`,
      status: 'Active',
      ...gradeData,
      minScore: Number(gradeData.minScore),
      maxScore: Number(gradeData.maxScore),
      gradePoint: Number(gradeData.gradePoint),
    }

    // Check for overlap against existing grades (excluding special absent grade 0-0)
    if (newGrade.grade !== 'AB' && (newGrade.minScore > 0 || newGrade.maxScore > 0)) {
      const hasOverlap = gradingSystem.grades.some((g) => {
        if (g.grade === 'AB' || (g.minScore === 0 && g.maxScore === 0)) return false
        return (
          (newGrade.minScore >= g.minScore && newGrade.minScore <= g.maxScore) ||
          (newGrade.maxScore >= g.minScore && newGrade.maxScore <= g.maxScore) ||
          (newGrade.minScore <= g.minScore && newGrade.maxScore >= g.maxScore)
        )
      })

      if (hasOverlap) {
        throw new Error('Score range overlaps with an existing configured grade boundary.')
      }
    }

    gradingSystem.grades = [...gradingSystem.grades, newGrade]
    return JSON.parse(JSON.stringify(gradingSystem))
  },

  updateGrade: async (gradeId, gradeData) => {
    await delay(250)
    const minScore = Number(gradeData.minScore)
    const maxScore = Number(gradeData.maxScore)
    const gradePoint = Number(gradeData.gradePoint)

    // Overlap validation
    if (gradeData.grade !== 'AB' && (minScore > 0 || maxScore > 0)) {
      const hasOverlap = gradingSystem.grades.some((g) => {
        if (g.id === gradeId || g.grade === 'AB' || (g.minScore === 0 && g.maxScore === 0)) return false
        return (
          (minScore >= g.minScore && minScore <= g.maxScore) ||
          (maxScore >= g.minScore && maxScore <= g.maxScore) ||
          (minScore <= g.minScore && maxScore >= g.maxScore)
        )
      })

      if (hasOverlap) {
        throw new Error('Score range overlaps with another grade boundary.')
      }
    }

    gradingSystem.grades = gradingSystem.grades.map((g) =>
      g.id === gradeId
        ? { ...g, ...gradeData, minScore, maxScore, gradePoint }
        : g
    )
    return JSON.parse(JSON.stringify(gradingSystem))
  },

  deleteGrade: async (gradeId) => {
    await delay(200)
    gradingSystem.grades = gradingSystem.grades.filter((g) => g.id !== gradeId)
    return JSON.parse(JSON.stringify(gradingSystem))
  },

  reorderGrades: async (newGrades) => {
    await delay(200)
    gradingSystem.grades = newGrades
    return JSON.parse(JSON.stringify(gradingSystem))
  },
}
