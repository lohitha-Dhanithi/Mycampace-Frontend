// src/modules/admissions/pages/ApplicationDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ApplicationProfile } from '../components/ApplicationProfile'
import { applicationService } from '../services/applicationService'
import { documentService } from '../services/documentService'
import { LoadingState } from '@/components/common/LoadingState'

export function ApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const [app, docs] = await Promise.all([
        applicationService.getApplicationById(id),
        documentService.getApplicationDocuments(id),
      ])
      setApplication(app)
      setDocuments(docs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleConfirmAdmission = async (appId, admissionData) => {
    await applicationService.convertToAdmission(appId, admissionData)
    showToast('Student Admission Confirmed Successfully!')
    loadData()
  }

  const handleEnrollToStudent = async (appId) => {
    const res = await applicationService.enrollStudentFromAdmission(appId)
    showToast(`Applicant converted to Student record: ${res.studentRecord.studentNumber}`)
    loadData()
  }

  const handleSendMessage = async (msg) => {
    if (!application) return
    const updated = {
      ...application,
      communications: [msg, ...(application.communications || [])],
    }
    await applicationService.updateApplication(application.id, updated)
    loadData()
    showToast('Message dispatched.')
  }

  const handleVerifyDoc = async (docId) => {
    await documentService.verifyDocument(docId, 'Committee Reviewer')
    loadData()
    showToast('Document marked as Verified.')
  }

  const handleRejectDoc = async (docId, reason) => {
    await documentService.rejectDocument(docId, reason, 'Committee Reviewer')
    loadData()
    showToast('Document marked as Rejected.')
  }

  if (loading) {
    return <LoadingState message="Loading application profile..." />
  }

  if (!application) {
    return <div className="p-8 text-center text-slate-500">Application not found.</div>
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-slate-700">
          {toast}
        </div>
      )}
      <ApplicationProfile
        application={application}
        documents={documents}
        onConfirmAdmission={handleConfirmAdmission}
        onEnrollToStudent={handleEnrollToStudent}
        onSendMessage={handleSendMessage}
        onVerifyDoc={handleVerifyDoc}
        onRejectDoc={handleRejectDoc}
      />
    </div>
  )
}
