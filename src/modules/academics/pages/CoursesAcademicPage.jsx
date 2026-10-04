// src/modules/academics/pages/CoursesAcademicPage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { CourseAcademicTable } from '../components/CourseAcademicTable'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function CoursesAcademicPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
    fetchCourses()
  }, [])

  if (loading) return <LoadingState message="Loading academic course catalog..." />

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses Management"
        description="Academic streams, departments, credits, and cohort enrollments."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Courses' },
        ]}
      />

      <CourseAcademicTable courses={courses} loading={loading} />
    </div>
  )
}
