// src/modules/academics/pages/SectionsAcademicPage.jsx
import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { SectionAcademicTable } from '../components/SectionAcademicTable'
import { StructureFormDialog } from '../components/StructureFormDialog'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function SectionsAcademicPage() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const fetchSections = async () => {
    setLoading(true)
    try {
      const list = await academicService.getAcademicSections()
      setSections(list)
    } catch (err) {
      console.error('Error fetching sections', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sections Management"
        description="Classroom section capacity tracking, homeroom rooms, and teacher allocations."
        actions={
          <Button size="sm" onClick={() => setOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add section
          </Button>
        }
      />

      {loading ? <LoadingState message="Loading classroom sections..." /> : <SectionAcademicTable sections={sections} loading={loading} />}
      <StructureFormDialog kind="section" open={open} onOpenChange={setOpen} onCreated={fetchSections} />
    </div>
  )
}
