// src/modules/students/services/guardianService.js
import { studentService } from './studentService'

export const guardianService = {
  getGuardians: async (studentId) => {
    return studentService.getGuardians(studentId)
  },

  createGuardian: async (data) => {
    return studentService.addGuardian(data)
  },

  updateGuardian: async (id, data) => {
    return studentService.updateGuardian(id, data)
  },

  setPrimaryGuardian: async (studentId, guardianId) => {
    return studentService.setPrimaryGuardian(studentId, guardianId)
  },

  removeGuardian: async (studentId, guardianId) => {
    return studentService.removeGuardian(studentId, guardianId)
  },
}
