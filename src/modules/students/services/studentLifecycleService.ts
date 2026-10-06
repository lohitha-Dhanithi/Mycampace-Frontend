// src/modules/students/services/studentLifecycleService.js
import { studentService } from './studentService'

export const studentLifecycleService = {
  // Transfers
  getTransfers: async () => {
    return studentService.getTransfers()
  },

  requestTransfer: async (data) => {
    return studentService.requestTransfer(data)
  },

  approveTransfer: async (id) => {
    return studentService.approveTransfer ? studentService.approveTransfer(id) : studentService.completeTransfer(id)
  },

  completeTransfer: async (id) => {
    return studentService.completeTransfer(id)
  },

  // Promotions
  getPromotionCandidates: async (filters: any = {}) => {
    return studentService.getStudents({
      ...filters,
      status: 'Active',
    })
  },

  promoteStudents: async (payload) => {
    return studentService.promoteStudents(payload)
  },

  // Exits
  getExits: async () => {
    return studentService.getExits()
  },

  requestStudentExit: async (data) => {
    return studentService.requestStudentExit(data)
  },

  approveStudentExit: async (id) => {
    return studentService.approveStudentExit ? studentService.approveStudentExit(id) : studentService.completeStudentExit(id)
  },

  completeStudentExit: async (id) => {
    return studentService.completeStudentExit(id)
  },
}
