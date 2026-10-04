// src/modules/academics/pages/AcademicDashboardPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { AcademicDashboard } from '../components/AcademicDashboard'
import { AcademicStructure } from '../components/AcademicStructure'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'
import { useTenantContext } from '@/store/TenantContext'

export function AcademicDashboardPage() {
  const { selectedCampus, selectedAcademicYear } = useTenantContext()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true)
      try {
        const data = await academicService.getAcademicOverview()
        setStats(data)
      } catch (err) {
        console.error('Failed to load academic overview', err)
      } finally {
        setLoading(false)
      }
    }
    fetchOverview()
  }, [selectedCampus, selectedAcademicYear])

  if (loading) {
    return <LoadingState message="Loading academic management cockpit..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academic Management"
        description="Manage academic operations, teaching assignments and student enrolments."
        breadcrumbs={[{ label: 'Academics' }, { label: 'Dashboard' }]}
      />

      <AcademicDashboard
        stats={stats}
        currentAcademicYear={selectedAcademicYear?.name || '2026–2027'}
      />

      <AcademicStructure counts={stats?.structure} />
    </div>
  )
}
