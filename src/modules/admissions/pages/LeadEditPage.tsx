// src/modules/admissions/pages/LeadEditPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { LeadForm } from '../components/LeadForm'
import { leadService } from '../services/leadService'
import { LoadingState } from '@/components/common/LoadingState'

export function LeadEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const data = await leadService.getLeadById(id)
      setLead(data)
      setLoading(false)
    }
    load()
  }, [id])

  const handleSubmit = async (formData) => {
    try {
      await leadService.updateLead(id, formData)
      navigate(`/admissions/leads/${id}`)
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return <LoadingState message="Loading lead information..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Lead: ${lead?.fullName}`}
        description="Update contact, academic preference or counselor assignments."
      />
      <LeadForm initialData={lead} onSubmit={handleSubmit} isEditing={true} />
    </div>
  )
}
