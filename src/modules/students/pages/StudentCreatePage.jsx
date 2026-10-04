// src/modules/students/pages/StudentCreatePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StudentForm } from '../components/StudentForm'
import { studentService } from '../services/studentService'
import { PageHeader } from '@/components/common/PageHeader'

export function StudentCreatePage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (studentData) => {
    setSubmitting(true)
    setError(null)
    try {
      const created = await studentService.createStudent(studentData)
      navigate(`/students/${created.id}`)
    } catch (err) {
      console.error('Failed to create student record:', err)
      setError(err.message || 'An unexpected error occurred while creating the student record.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enroll New Student"
        description="Create a student record directly or convert an approved application from Admissions CRM."
        breadcrumbs={[
          { label: 'Students', href: '/students' },
          { label: 'New Enrolment' },
        ]}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
          <strong>Validation Error:</strong> {error}
        </div>
      )}

      <StudentForm onSubmit={handleSubmit} isEditing={false} />
    </div>
  )
}
