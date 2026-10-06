// src/modules/students/services/studentDocumentService.js
import { studentService } from './studentService'

export const studentDocumentService = {
  getStudentDocuments: async (studentId) => {
    return studentService.getDocuments(studentId)
  },

  uploadStudentDocument: async (data) => {
    return studentService.uploadDocument(data)
  },

  verifyStudentDocument: async (id, verifiedBy = 'Academic Registrar') => {
    return studentService.verifyDocument(id, verifiedBy)
  },

  rejectStudentDocument: async (id, reason) => {
    return studentService.rejectDocument(id, reason)
  },
}
