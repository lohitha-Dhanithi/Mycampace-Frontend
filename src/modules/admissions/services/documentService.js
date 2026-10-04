// src/modules/admissions/services/documentService.js
import { INITIAL_APPLICATION_DOCUMENTS } from '../data/documentMockData'

let documents = [...INITIAL_APPLICATION_DOCUMENTS]
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const documentService = {
  getApplicationDocuments: async (applicationId) => {
    await delay(120)
    if (!applicationId) return [...documents]
    return documents.filter((d) => d.applicationId === applicationId)
  },

  getAllDocuments: async (filters = {}) => {
    await delay(120)
    let result = [...documents]
    if (filters.status && filters.status !== 'all') {
      result = result.filter((d) => d.verificationStatus.toLowerCase() === filters.status.toLowerCase())
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter((d) =>
        d.fileName?.toLowerCase().includes(q) ||
        d.type?.toLowerCase().includes(q) ||
        d.applicationId?.toLowerCase().includes(q)
      )
    }
    return result
  },

  uploadDocument: async (applicationId, docData) => {
    await delay(250)
    const existingIndex = documents.findIndex(
      (d) => d.applicationId === applicationId && d.type === docData.type
    )

    const updatedDoc = {
      id: docData.id || `doc-${Date.now()}`,
      applicationId,
      type: docData.type,
      code: docData.code || 'DOC',
      fileName: docData.fileName || 'Uploaded_Document.pdf',
      fileSize: docData.fileSize || '1.4 MB',
      required: true,
      uploaded: true,
      verificationStatus: 'Pending',
      uploadedDate: new Date().toISOString().split('T')[0],
      verifiedBy: null,
      verifiedDate: null,
      rejectionReason: null,
    }

    if (existingIndex >= 0) {
      documents[existingIndex] = { ...documents[existingIndex], ...updatedDoc }
      return documents[existingIndex]
    } else {
      documents = [updatedDoc, ...documents]
      return updatedDoc
    }
  },

  verifyDocument: async (id, reviewerName = 'Admissions Reviewer') => {
    await delay(180)
    documents = documents.map((d) =>
      d.id === id
        ? {
            ...d,
            verificationStatus: 'Verified',
            verifiedBy: reviewerName,
            verifiedDate: new Date().toISOString().split('T')[0],
            rejectionReason: null,
          }
        : d
    )
    return documents.find((d) => d.id === id)
  },

  rejectDocument: async (id, reason, reviewerName = 'Admissions Reviewer') => {
    await delay(180)
    documents = documents.map((d) =>
      d.id === id
        ? {
            ...d,
            verificationStatus: 'Rejected',
            verifiedBy: reviewerName,
            verifiedDate: new Date().toISOString().split('T')[0],
            rejectionReason: reason || 'Document rejected. Please upload clearer copy.',
          }
        : d
    )
    return documents.find((d) => d.id === id)
  },
}
