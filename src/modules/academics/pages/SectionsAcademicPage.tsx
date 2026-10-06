// src/modules/academics/pages/SectionsAcademicPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { SectionAcademicTable } from '../components/SectionAcademicTable'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function SectionsAcademicPage() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true)
      try {
        const list = await academicService.getAcademicSections()
        setSections(list)
      } catch (err) {
        console.error('Error fetching sections', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSections()
  }, [])

  if (loading) return <LoadingState message="Loading classroom sections..." />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sections Management"
        description="Classroom section capacity tracking, homeroom rooms, and teacher allocations."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Sections' },
        ]}
      />

      <SectionAcademicTable sections={sections} loading={loading} />
    </div>
  )
}
