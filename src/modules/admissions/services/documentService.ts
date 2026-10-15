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

  getAllDocuments: async (filters: any = {}) => {
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

  uploadDocument: async (applicationId, docData: any = {}) => {
    await delay(250)
    const existingIndex = documents.findIndex((d) => {
      if (d.applicationId !== applicationId) return false
      if (docData.id && d.id === docData.id) return true
      if (docData.code && d.code && d.code.toUpperCase() === docData.code.toUpperCase()) return true
      if (docData.type && d.type && d.type.toLowerCase() === docData.type.toLowerCase()) return true
      if (
        (d.type?.toLowerCase().includes('transfer') || d.code === 'TC') &&
        (docData.type?.toLowerCase().includes('transfer') || docData.code === 'TC')
      ) {
        return true
      }
      return false
    })

    const isSimulateSuccess =
      docData.verificationStatus === 'Verified' ||
      docData.simulateSuccess ||
      docData.autoVerify

    const updatedDoc = {
      id: docData.id || (existingIndex >= 0 ? documents[existingIndex].id : `doc-${Date.now()}`),
      applicationId,
      type: docData.type || (existingIndex >= 0 ? documents[existingIndex].type : 'Document'),
      code: docData.code || (existingIndex >= 0 ? documents[existingIndex].code : 'DOC'),
      fileName: docData.fileName || 'Uploaded_Document.pdf',
      fileSize: docData.fileSize || '1.4 MB',
      required: true,
      uploaded: true,
      verificationStatus: isSimulateSuccess ? 'Verified' : docData.verificationStatus || 'Pending',
      uploadedDate: new Date().toISOString().split('T')[0],
      verifiedBy: isSimulateSuccess ? docData.verifiedBy || 'Admissions Reviewer' : null,
      verifiedDate: isSimulateSuccess ? new Date().toISOString().split('T')[0] : null,
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

  attachAndVerifyDocument: async (
    applicationId: string,
    docIdOrCode: string,
    reviewerName = 'Admissions Reviewer'
  ) => {
    await delay(180)
    const today = new Date().toISOString().split('T')[0]
    let targetIndex = documents.findIndex(
      (d) =>
        d.applicationId === applicationId &&
        (d.id === docIdOrCode || (d.code && d.code.toUpperCase() === docIdOrCode.toUpperCase()))
    )

    if (targetIndex >= 0) {
      const existing = documents[targetIndex]
      const defaultFileName =
        existing.code === 'TC' || existing.type.toLowerCase().includes('transfer')
          ? 'Transfer_Certificate_Signed.pdf'
          : `${existing.type.replace(/\s+/g, '_')}_Verified.pdf`

      documents[targetIndex] = {
        ...existing,
        uploaded: true,
        fileName: existing.fileName || defaultFileName,
        fileSize: existing.fileSize || '1.1 MB',
        verificationStatus: 'Verified',
        uploadedDate: existing.uploadedDate || today,
        verifiedBy: reviewerName,
        verifiedDate: today,
        rejectionReason: null,
      }
      return documents[targetIndex]
    } else {
      // Create if missing
      const newDoc = {
        id: `doc-${Date.now()}`,
        applicationId,
        type: docIdOrCode === 'TC' ? 'Transfer Certificate' : 'Required Document',
        code: docIdOrCode || 'DOC',
        fileName: docIdOrCode === 'TC' ? 'Transfer_Certificate_Signed.pdf' : 'Verified_Credential.pdf',
        fileSize: '1.2 MB',
        required: true,
        uploaded: true,
        verificationStatus: 'Verified',
        uploadedDate: today,
        verifiedBy: reviewerName,
        verifiedDate: today,
        rejectionReason: null,
      }
      documents = [newDoc, ...documents]
      return newDoc
    }
  },

  attachAndVerifyAllDocuments: async (
    applicationId: string,
    reviewerName = 'Admissions Committee'
  ) => {
    await delay(200)
    const today = new Date().toISOString().split('T')[0]
    const sampleFiles: Record<string, string> = {
      BC: 'Birth_Certificate_Attested.pdf',
      PR: 'Class_10_Board_Marksheet.pdf',
      TC: 'Transfer_Certificate_Signed.pdf',
      AAD: 'Identity_Proof_Aadhaar.pdf',
      ADDR: 'Address_Proof_Electricity_Bill.pdf',
      MED: 'Medical_Fitness_Certificate.pdf',
    }

    let appDocs = documents.filter((d) => d.applicationId === applicationId)

    // Ensure TC exists if missing
    const hasTC = appDocs.some(
      (d) => d.code === 'TC' || d.type.toLowerCase().includes('transfer')
    )
    if (!hasTC) {
      const tcDoc = {
        id: `doc-${Date.now()}-tc`,
        applicationId,
        type: 'Transfer Certificate',
        code: 'TC',
        fileName: 'Transfer_Certificate_Signed.pdf',
        fileSize: '950 KB',
        required: true,
        uploaded: true,
        verificationStatus: 'Verified',
        uploadedDate: today,
        verifiedBy: reviewerName,
        verifiedDate: today,
        rejectionReason: null,
      }
      documents = [...documents, tcDoc]
    }

    documents = documents.map((d) => {
      if (d.applicationId === applicationId) {
        const fallbackName = sampleFiles[d.code] || `${d.type.replace(/\s+/g, '_')}_Signed.pdf`
        return {
          ...d,
          uploaded: true,
          fileName: d.fileName || fallbackName,
          fileSize: d.fileSize || (d.code === 'TC' ? '950 KB' : '1.4 MB'),
          verificationStatus: 'Verified',
          uploadedDate: d.uploadedDate || today,
          verifiedBy: reviewerName,
          verifiedDate: today,
          rejectionReason: null,
        }
      }
      return d
    })

    return documents.filter((d) => d.applicationId === applicationId)
  },

  verifyDocument: async (id, reviewerName = 'Admissions Reviewer') => {
    await delay(180)
    documents = documents.map((d) =>
      d.id === id
        ? {
            ...d,
            uploaded: true,
            fileName: d.fileName || `${d.type.replace(/\s+/g, '_')}_Signed.pdf`,
            fileSize: d.fileSize || '1.1 MB',
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
