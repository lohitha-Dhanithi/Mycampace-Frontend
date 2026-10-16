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
  const [editingItem, setEditingItem] = useState(null)

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

  const handleEdit = (course) => {
    setEditingItem(course)
    setOpen(true)
  }

  const handleCreate = () => {
    setEditingItem(null)
    setOpen(true)
  }

  const handleToggleStatus = async (course) => {
    const nextStatus = course.status === 'Active' ? 'Inactive' : 'Active'
    await academicService.updateAcademicCourse(course.id, { status: nextStatus })
    fetchCourses()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses Management"
        description="Distinct curriculum offerings within programs (e.g. Higher Secondary Science, B.Tech CSE), duration, intake, and credits."
        actions={
          <Button size="sm" onClick={handleCreate} className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Course
          </Button>
        }
      />

      {loading ? (
        <LoadingState message="Loading academic course catalog..." />
      ) : (
        <CourseAcademicTable
          courses={courses}
          loading={loading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      )}
      <StructureFormDialog
        kind="course"
        open={open}
        initialData={editingItem}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) setEditingItem(null)
        }}
        onCreated={fetchCourses}
      />
    </div>
  )
}
