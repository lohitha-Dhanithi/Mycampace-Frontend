// src/modules/students/services/studentAcademicService.js
import { studentService } from './studentService'

export const studentAcademicService = {
  getStudentAcademicRecords: async (studentId) => {
    return studentService.getAcademicRecords(studentId)
  },

  getCurrentAcademicRecord: async (studentId) => {
    return studentService.getCurrentAcademicRecord(studentId)
  },

  createAcademicRecord: async (data) => {
    return studentService.createAcademicRecord(data)
  },

  updateAcademicRecord: async (id, data) => {
    return studentService.updateAcademicRecord(id, data)
  },
}
