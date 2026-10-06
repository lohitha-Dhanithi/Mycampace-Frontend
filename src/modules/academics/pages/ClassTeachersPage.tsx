// src/modules/academics/pages/ClassTeachersPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { ClassTeacherTable } from '../components/ClassTeacherTable'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function ClassTeachersPage() {
  const [classTeachers, setClassTeachers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await academicService.getClassTeachers()
      setClassTeachers(data)
    } catch (err) {
      console.error('Failed to load class teachers', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAssignClassTeacher = async (data) => {
    await academicService.assignClassTeacher(data)
    await loadData()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Teacher Management"
        description="Assign primary homeroom educators to section units with uniqueness rule enforcement."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Class Teachers' },
        ]}
      />

      <ClassTeacherTable
        classTeachers={classTeachers}
        loading={loading}
        onAssignClassTeacher={handleAssignClassTeacher}
      />
    </div>
  )
}
