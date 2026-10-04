// src/modules/academics/pages/SubjectAssignmentsPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { SubjectAssignmentTable } from '../components/SubjectAssignmentTable'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function SubjectAssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAssignments = async () => {
    setLoading(true)
    try {
      const data = await academicService.getSubjectAssignments()
      setAssignments(data)
    } catch (err) {
      console.error('Failed to load subject assignments', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssignments()
  }, [])

  const handleCreate = async (data) => {
    await academicService.createSubjectAssignment(data)
    await loadAssignments()
  }

  const handleUpdate = async (id, data) => {
    await academicService.updateSubjectAssignment(id, data)
    await loadAssignments()
  }

  const handleRemove = async (id) => {
    await academicService.removeSubjectAssignment(id)
    await loadAssignments()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subject Delivery Assignments"
        description="Map curriculum syllabus subjects to classroom sections and assign educator leads."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Subject Assignments' },
        ]}
      />

      <SubjectAssignmentTable
        assignments={assignments}
        loading={loading}
        onCreateAssignment={handleCreate}
        onUpdateAssignment={handleUpdate}
        onRemoveAssignment={handleRemove}
      />
    </div>
  )
}
