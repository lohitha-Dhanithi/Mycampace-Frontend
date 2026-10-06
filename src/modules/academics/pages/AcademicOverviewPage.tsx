// src/modules/academics/pages/AcademicOverviewPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { AcademicOverview } from '../components/AcademicOverview'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function AcademicOverviewPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await academicService.getAcademicOverview()
        setData(res)
      } catch (err) {
        console.error('Error fetching academic overview', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <LoadingState message="Analyzing academic structure and teaching deployment..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Overview & Structure Pipeline"
        description="Comprehensive map of programs, courses, classroom cohorts, and teaching deployment."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Overview' },
        ]}
      />

      <AcademicOverview overviewData={data} />
    </div>
  )
}
