// src/modules/academics/pages/SubjectsAcademicPage.jsx
import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { SubjectAcademicTable } from '../components/SubjectAcademicTable'
import { StructureFormDialog } from '../components/StructureFormDialog'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function SubjectsAcademicPage() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const fetchSubjects = async () => {
    setLoading(true)
    try {
      const list = await academicService.getAcademicSubjects()
      setSubjects(list)
    } catch (err) {
      console.error('Error fetching subjects', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects Management"
        description="Curriculum syllabus subjects, credit allocations, and educator assignments."
        actions={
          <Button size="sm" onClick={() => setOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add subject
          </Button>
        }
      />

      {loading ? <LoadingState message="Loading subjects catalog..." /> : <SubjectAcademicTable subjects={subjects} loading={loading} />}
      <StructureFormDialog kind="subject" open={open} onOpenChange={setOpen} onCreated={fetchSubjects} />
    </div>
  )
}
