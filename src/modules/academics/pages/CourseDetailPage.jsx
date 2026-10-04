// src/modules/academics/pages/CourseDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CourseAcademicProfile } from '../components/CourseAcademicProfile'
import { academicService } from '../services/academicService'
import { studentService } from '@/modules/students/services/studentService'
import { LoadingState } from '@/components/common/LoadingState'
import { Button } from '@/components/ui/button'

export function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [crs, subs, clss, facs, stus] = await Promise.all([
          academicService.getAcademicCourseById(id),
          academicService.getAcademicSubjects(),
          academicService.getAcademicClasses(),
          academicService.getFacultyAssignments(),
          studentService.getStudents(),
        ])
        setCourse(crs)
        setSubjects(subs)
        setClasses(clss)
        setFaculty(facs)
        setStudents(stus)
      } catch (err) {
        console.error('Failed to load course details', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <LoadingState message="Loading course dossier..." />

  if (!course) {
    return (
      <div className="py-16 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-800">Course Not Found</h3>
        <Button size="sm" onClick={() => navigate('/academics/courses')}>
          Back to Courses
        </Button>
      </div>
    )
  }

  return (
    <CourseAcademicProfile
      course={course}
      subjects={subjects}
      classes={classes}
      faculty={faculty}
      students={students}
    />
  )
}
