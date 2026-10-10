// src/modules/academics/pages/CoursesAcademicPage.jsx
import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { CourseAcademicTable } from '../components/CourseAcademicTable'
import { StructureFormDialog } from '../components/StructureFormDialog'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function CoursesAcademicPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const list = await academicService.getAcademicCourses()
      setCourses(list)
    } catch (err) {
      console.error('Error fetching courses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses Management"
        description="Academic streams, departments, credits, and cohort enrollments."
        actions={
          <Button size="sm" onClick={() => setOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add course
          </Button>
        }
      />

      {loading ? <LoadingState message="Loading academic course catalog..." /> : <CourseAcademicTable courses={courses} loading={loading} />}
      <StructureFormDialog kind="course" open={open} onOpenChange={setOpen} onCreated={fetchCourses} />
    </div>
  )
}
