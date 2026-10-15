// src/modules/admissions/pages/CounsellingCreatePage.jsx
import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { CounsellingForm } from '../components/CounsellingForm'
import { counsellingService } from '../services/counsellingService'
import { useNavigate } from 'react-router-dom'

export function CounsellingCreatePage() {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    try {
      await counsellingService.scheduleCounselling(formData)
      navigate('/app/admissions/counselling')
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule Counselling Session"
        description="Book a 1-on-1 parent and student counselling consultation."
      />
      <CounsellingForm onSubmit={handleSubmit} />
    </div>
  )
}
