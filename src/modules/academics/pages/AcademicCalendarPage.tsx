// src/modules/academics/pages/AcademicCalendarPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { AcademicCalendar } from '../components/AcademicCalendar'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function AcademicCalendarPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const loadEvents = async () => {
    setLoading(true)
    try {
      const data = await academicService.getAcademicEvents()
      setEvents(data)
    } catch (err) {
      console.error('Failed to load academic events', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handlePublish = async (id) => {
    await academicService.publishAcademicEvent(id)
    await loadEvents()
  }

  const handleCancel = async (id) => {
    await academicService.cancelAcademicEvent(id)
    await loadEvents()
  }

  const handleDelete = async (id) => {
    await academicService.deleteAcademicEvent(id)
    await loadEvents()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Calendar"
        description="Term dates, examination sessions, recess holidays, and institutional milestones."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Calendar' },
        ]}
      />

      <AcademicCalendar
        events={events}
        loading={loading}
        onPublishEvent={handlePublish}
        onCancelEvent={handleCancel}
        onDeleteEvent={handleDelete}
      />
    </div>
  )
}
