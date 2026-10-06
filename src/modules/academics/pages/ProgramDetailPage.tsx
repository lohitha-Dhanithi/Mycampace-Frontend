// src/modules/academics/pages/ProgramDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ProgramAcademicProfile } from '../components/ProgramAcademicProfile'
import { academicService } from '../services/academicService'
import { studentService } from '@/modules/students/services/studentService'
import { LoadingState } from '@/components/common/LoadingState'
import { Button } from '@/components/ui/button'

export function ProgramDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [courses, setCourses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [faculty, setFaculty] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [prog, crss, subs, stus, facs, evts] = await Promise.all([
          academicService.getAcademicProgramById(id),
          academicService.getAcademicCourses(),
          academicService.getAcademicSubjects(),
          studentService.getStudents(),
          academicService.getFacultyAssignments(),
          academicService.getAcademicEvents(),
        ])
        setProgram(prog)
        setCourses(crss.filter((c) => !c.programId || c.programId === id))
        setSubjects(subs)
        setStudents(stus)
        setFaculty(facs)
        setEvents(evts)
      } catch (err) {
        console.error('Failed to load program dossier', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <LoadingState message="Loading program academic profile..." />

  if (!program) {
    return (
      <div className="py-16 text-center space-y-3">
        <h3 className="text-base font-bold text-slate-800">Program Not Found</h3>
        <Button size="sm" onClick={() => navigate('/academics/programs')}>
          Back to Programs
        </Button>
      </div>
    )
  }

  return (
    <ProgramAcademicProfile
      program={program}
      courses={courses}
      subjects={subjects}
      students={students}
      faculty={faculty}
      events={events}
    />
  )
}
