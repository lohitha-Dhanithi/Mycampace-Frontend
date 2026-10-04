// src/modules/academics/pages/StudentEnrolmentsPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { StudentEnrolmentTable } from '../components/StudentEnrolmentTable'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function StudentEnrolmentsPage() {
  const [enrolments, setEnrolments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadEnrolments = async () => {
    setLoading(true)
    try {
      const data = await academicService.getStudentEnrolments()
      setEnrolments(data)
    } catch (err) {
      console.error('Failed to load student enrolments', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnrolments()
  }, [])

  const handleChangeSection = async (studentId, payload) => {
    await academicService.changeStudentSection(studentId, payload)
    await loadEnrolments()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Academic Enrolments"
        description="Active classroom cohorts synchronized with the Student Information System."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Enrolments' },
        ]}
      />

      <StudentEnrolmentTable
        enrolments={enrolments}
        loading={loading}
        onChangeSectionConfirm={handleChangeSection}
      />
    </div>
  )
}
