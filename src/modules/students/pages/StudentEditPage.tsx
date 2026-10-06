// src/modules/students/pages/StudentEditPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { StudentForm } from '../components/StudentForm'
import { studentService } from '../services/studentService'
import { PageHeader } from '@/components/common/PageHeader'
import { LoadingState } from '@/components/common/LoadingState'
import { Button } from '@/components/ui/button'

export function StudentEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true)
      const data = await studentService.getStudentById(id)
      setStudent(data)
      setLoading(false)
    }
    fetchStudent()
  }, [id])

  const handleSubmit = async (updatedData) => {
    setSubmitting(true)
    setError(null)
    try {
      await studentService.updateStudent(id, updatedData)
      navigate(`/students/${id}`)
    } catch (err) {
      console.error('Failed to update student profile:', err)
      setError(err.message || 'Failed to update student record.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading student profile details..." />
  }

  if (!student) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-500">Student record not found.</p>
        <Button size="sm" onClick={() => navigate('/students')} className="mt-4">
          Return to Student Directory
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Edit Student Profile: ${student.personal?.fullName || student.name}`}
        description="Update personal identification, address, and academic parameters."
        breadcrumbs={[
          { label: 'Students', href: '/students' },
          { label: student.personal?.fullName || student.name, href: `/students/${id}` },
          { label: 'Edit' },
        ]}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
          <strong>Error:</strong> {error}
        </div>
      )}

      <StudentForm initialData={student} onSubmit={handleSubmit} isEditing={true} />
    </div>
  )
}
