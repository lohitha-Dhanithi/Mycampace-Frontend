// src/modules/academics/pages/AcademicEventCreatePage.jsx
import React, { useState } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { AcademicEventForm } from '../components/AcademicEventForm'
import { academicService } from '../services/academicService'
import { useNavigate } from 'react-router-dom'

export function AcademicEventCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      await academicService.createAcademicEvent(data)
      navigate('/academics/academic-calendar')
    } catch (err) {
      console.error('Error creating event', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schedule Academic Event"
        description="Publish term commencements, examination periods, PTMs, and official institutional breaks."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Academic Calendar', href: '/academics/academic-calendar' },
          { label: 'New Event' },
        ]}
      />

      <AcademicEventForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/academics/academic-calendar')}
        submitting={submitting}
      />
    </div>
  )
}
