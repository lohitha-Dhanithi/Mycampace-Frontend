// src/modules/admissions/pages/ApplicationCreatePage.jsx
import React from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { ApplicationForm } from '../components/ApplicationForm'
import { applicationService } from '../services/applicationService'
import { useNavigate } from 'react-router-dom'

export function ApplicationCreatePage() {
  const navigate = useNavigate()

  const handleSaveDraft = async (formData) => {
    try {
      const app = await applicationService.createApplication(formData)
      navigate(`/admissions/applications/${app.id}`)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleSubmitApplication = async (formData) => {
    try {
      const app = await applicationService.createApplication(formData)
      await applicationService.submitApplication(app.id)
      navigate(`/admissions/applications/${app.id}`)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Student Application"
        description="Complete all multi-step application sections to enroll student for admission."
      />
      <ApplicationForm
        onSaveDraft={handleSaveDraft}
        onSubmitApplication={handleSubmitApplication}
      />
    </div>
  )
}
