// src/modules/admissions/pages/ApplicationReviewPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { ApplicationReview } from '../components/ApplicationReview'
import { applicationService } from '../services/applicationService'
import { documentService } from '../services/documentService'
import { LoadingState } from '@/components/common/LoadingState'

export function ApplicationReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

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

  const handleVerifyDoc = async (docId) => {
    await documentService.verifyDocument(docId, 'Admissions Reviewer')
    loadData()
  }

  const handleRejectDoc = async (docId, reason) => {
    await documentService.rejectDocument(docId, reason, 'Admissions Reviewer')
    loadData()
  }

  const handleSubmitDecision = async (decisionData) => {
    try {
      await applicationService.reviewApplication(id, decisionData)
      navigate(`/admissions/applications/${id}`)
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return <LoadingState message="Loading review workspace..." />
  }

  if (!application) {
    return <div className="p-8 text-center text-slate-500">Application not found.</div>
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Review Application: ${application.applicationNumber}`}
        description="Verify submitted documents and declare official admission committee decision."
      />
      <ApplicationReview
        application={application}
        documents={documents}
        onVerifyDoc={handleVerifyDoc}
        onRejectDoc={handleRejectDoc}
        onSubmitDecision={handleSubmitDecision}
      />
    </div>
  )
}
