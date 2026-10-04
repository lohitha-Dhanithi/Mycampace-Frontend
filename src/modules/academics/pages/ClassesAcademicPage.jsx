// src/modules/academics/pages/ClassesAcademicPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { ClassAcademicTable } from '../components/ClassAcademicTable'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function ClassesAcademicPage() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true)
      try {
        const list = await academicService.getAcademicClasses()
        setClasses(list)
      } catch (err) {
        console.error('Error fetching classes', err)
      } finally {
        setLoading(false)
      }
    }
    fetchClasses()
  }, [])

  if (loading) return <LoadingState message="Loading class cohorts..." />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes Management"
        description="Class cohort rosters, assigned sections, student counts, and homeroom leads."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Classes' },
        ]}
      />

      <ClassAcademicTable classes={classes} loading={loading} />
    </div>
  )
}
