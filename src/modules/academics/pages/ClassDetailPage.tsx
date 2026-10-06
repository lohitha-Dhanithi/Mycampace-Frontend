// src/modules/academics/pages/ClassDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ClassAcademicProfile } from '../components/ClassAcademicProfile'
import { academicService } from '../services/academicService'
import { studentService } from '@/modules/students/services/studentService'
import { LoadingState } from '@/components/common/LoadingState'
import { Button } from '@/components/ui/button'

export function ClassDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cls, setCls] = useState(null)
  const [sections, setSections] = useState([])
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [c, secs, subs, stus, facs] = await Promise.all([
          academicService.getAcademicClassById(id),
          academicService.getAcademicSections(),
          academicService.getAcademicSubjects(),
          studentService.getStudents(),
          academicService.getFacultyAssignments(),
        ])
        setCls(c)
        setSections(secs.filter((s) => !s.classId || s.classId === id))
        setSubjects(subs)
        setStudents(stus)
        setFaculty(facs.filter((f) => f.classId === id))
      } catch (err) {
        console.error('Failed to load class profile', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <LoadingState message="Loading class dossier..." />

  if (!cls) {
    return (
      <div className="py-16 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-800">Class Record Not Found</h3>
        <Button size="sm" onClick={() => navigate('/academics/classes')}>
          Back to Classes
        </Button>
      </div>
    )
  }

  return (
    <ClassAcademicProfile
      academicClass={cls}
      sections={sections}
      subjects={subjects}
      students={students}
      faculty={faculty}
    />
  )
}
