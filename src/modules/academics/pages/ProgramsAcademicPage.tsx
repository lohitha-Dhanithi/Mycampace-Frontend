// src/modules/academics/pages/ProgramsAcademicPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { ProgramAcademicTable } from '../components/ProgramAcademicTable'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function ProgramsAcademicPage() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true)
      try {
        const list = await academicService.getAcademicPrograms()
        setPrograms(list)
      } catch (err) {
        console.error('Error fetching programs', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  if (loading) return <LoadingState message="Loading operational academic programs..." />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programs Management"
        description="Operational view of curriculum frameworks, durations, and course streams."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Programs' },
        ]}
      />

      <ProgramAcademicTable programs={programs} loading={loading} />
    </div>
  )
}
