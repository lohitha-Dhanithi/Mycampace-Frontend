// src/modules/academics/pages/ProgramsAcademicPage.jsx
import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { ProgramAcademicTable } from '../components/ProgramAcademicTable'
import { StructureFormDialog } from '../components/StructureFormDialog'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function ProgramsAcademicPage() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const fetchPrograms = async () => {
    setLoading(true)
    try {
      const list = await academicService.getAcademicPrograms()
      setPrograms(list)
    } catch (err) {
      console.error('Error fetching programs', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programs Management"
        description="Operational view of curriculum frameworks, durations, and course streams."
        actions={
          <Button size="sm" onClick={() => setOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add program
          </Button>
        }
      />

      {loading ? <LoadingState message="Loading operational academic programs..." /> : <ProgramAcademicTable programs={programs} loading={loading} />}
      <StructureFormDialog kind="program" open={open} onOpenChange={setOpen} onCreated={fetchPrograms} />
    </div>
  )
}
