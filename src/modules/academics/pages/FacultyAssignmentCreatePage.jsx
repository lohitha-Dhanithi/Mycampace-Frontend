// src/modules/academics/pages/FacultyAssignmentCreatePage.jsx
import React, { useState, useEffect } from 'react'
import { PageHeader } from '@/components/common/PageHeader'
import { FacultyAssignmentForm } from '../components/FacultyAssignmentForm'
import { academicService } from '../services/academicService'
import { useNavigate } from 'react-router-dom'

export function FacultyAssignmentCreatePage() {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [subjects, setSubjects] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [c, s, sub] = await Promise.all([
        academicService.getAcademicClasses(),
        academicService.getAcademicSections(),
        academicService.getAcademicSubjects(),
      ])
      setClasses(c)
      setSections(s)
      setSubjects(sub)
    }
    load()
  }, [])

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      await academicService.createFacultyAssignment(data)
      navigate('/academics/faculty-assignments')
    } catch (err) {
      console.error('Error creating assignment', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assign Faculty Member"
        description="Deploy an educator to curriculum subjects, classroom units, and specific roles."
        breadcrumbs={[
          { label: 'Academics', href: '/academics' },
          { label: 'Faculty Assignments', href: '/academics/faculty-assignments' },
          { label: 'New Assignment' },
        ]}
      />

      <FacultyAssignmentForm
        classes={classes}
        sections={sections}
        subjects={subjects}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/academics/faculty-assignments')}
        submitting={submitting}
      />
    </div>
  )
}
