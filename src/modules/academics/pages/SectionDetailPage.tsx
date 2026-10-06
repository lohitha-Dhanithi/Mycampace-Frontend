// src/modules/academics/pages/SectionDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SectionAcademicProfile } from '../components/SectionAcademicProfile'
import { academicService } from '../services/academicService'
import { studentService } from '@/modules/students/services/studentService'
import { LoadingState } from '@/components/common/LoadingState'
import { Button } from '@/components/ui/button'

export function SectionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [section, setSection] = useState(null)
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [sec, stus, subs, facs] = await Promise.all([
          academicService.getAcademicSectionById(id),
          studentService.getStudents(),
          academicService.getAcademicSubjects(),
          academicService.getFacultyAssignments(),
        ])
        setSection(sec)
        setStudents(stus)
        setSubjects(subs)
        setFaculty(facs.filter((f) => !f.sectionId || f.sectionId === id))
      } catch (err) {
        console.error('Failed to load section details', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <LoadingState message="Loading section profile..." />

  if (!section) {
    return (
      <div className="py-16 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-800">Section Not Found</h3>
        <Button size="sm" onClick={() => navigate('/academics/sections')}>
          Back to Sections
        </Button>
      </div>
    )
  }

  return (
    <SectionAcademicProfile
      section={section}
      students={students}
      subjects={subjects}
      faculty={faculty}
    />
  )
}
