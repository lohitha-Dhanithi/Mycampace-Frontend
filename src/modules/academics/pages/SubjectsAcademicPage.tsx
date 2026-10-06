// src/modules/academics/pages/SubjectsAcademicPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { SubjectAcademicTable } from '../components/SubjectAcademicTable'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function SubjectsAcademicPage() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true)
      try {
        const list = await academicService.getAcademicSubjects()
        setSubjects(list)
      } catch (err) {
        console.error('Error fetching subjects', err)
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
  }, [])

  if (loading) return <LoadingState message="Loading subjects catalog..." />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects Management"
        description="Curriculum syllabus subjects, credit allocations, and educator assignments."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Subjects' },
        ]}
      />

      <SubjectAcademicTable subjects={subjects} loading={loading} />
    </div>
  )
}
