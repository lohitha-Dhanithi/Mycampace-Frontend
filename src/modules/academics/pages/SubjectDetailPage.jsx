// src/modules/academics/pages/SubjectDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SubjectAcademicProfile } from '../components/SubjectAcademicProfile'
import { academicService } from '../services/academicService'
import { studentService } from '@/modules/students/services/studentService'
import { LoadingState } from '@/components/common/LoadingState'
import { Button } from '@/components/ui/button'

export function SubjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [subject, setSubject] = useState(null)
  const [classes, setClasses] = useState([])
  const [faculty, setFaculty] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [sub, clss, facs, stus] = await Promise.all([
          academicService.getAcademicSubjectById(id),
          academicService.getAcademicClasses(),
          academicService.getFacultyAssignments(),
          studentService.getStudents(),
        ])
        setSubject(sub)
        setClasses(clss)
        setFaculty(facs.filter((f) => f.subjectId === id))
        setStudents(stus)
      } catch (err) {
        console.error('Failed to load subject details', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <LoadingState message="Loading subject profile..." />

  if (!subject) {
    return (
      <div className="py-16 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-800">Subject Not Found</h3>
        <Button size="sm" onClick={() => navigate('/academics/subjects')}>
          Back to Subjects
        </Button>
      </div>
    )
  }

  return (
    <SubjectAcademicProfile
      subject={subject}
      classes={classes}
      faculty={faculty}
      students={students}
    />
  )
}
