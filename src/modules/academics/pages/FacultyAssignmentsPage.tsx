// src/modules/academics/pages/FacultyAssignmentsPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { FacultyAssignmentTable } from '../components/FacultyAssignmentTable'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function FacultyAssignmentsPage() {
  const navigate = useNavigate()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAssignments = async () => {
    setLoading(true)
    try {
      const data = await academicService.getFacultyAssignments()
      setAssignments(data)
    } catch (err) {
      console.error('Failed to load faculty assignments', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAssignments()
  }, [])

  const handleRemoveAssignment = async (id) => {
    await academicService.removeFacultyAssignment(id)
    await loadAssignments()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Faculty Teaching Assignments"
          description="Operational deployment of educators across subjects, grades, and homeroom sections."
          breadcrumbs={[
            { label: 'Academics', href: '/academics' },
            { label: 'Faculty Assignments' },
          ]}
        />

        <Button
          size="sm"
          onClick={() => navigate('/academics/faculty-assignments/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Assign Educator
        </Button>
      </div>

      <FacultyAssignmentTable
        assignments={assignments}
        loading={loading}
        onRemoveAssignment={handleRemoveAssignment}
      />
    </div>
  )
}
