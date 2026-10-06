// src/modules/admissions/pages/LeadCreatePage.jsx
import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { LeadForm } from '../components/LeadForm'
import { leadService } from '../services/leadService'
import { useNavigate } from 'react-router-dom'

export function LeadCreatePage() {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    try {
      const created = await leadService.createLead(formData)
      navigate(`/admissions/leads/${created.id}`)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Prospective Lead"
        description="Register an incoming prospective student lead and assign to an admissions counselor."
      />
      <LeadForm onSubmit={handleSubmit} isEditing={false} />
    </div>
  )
}
