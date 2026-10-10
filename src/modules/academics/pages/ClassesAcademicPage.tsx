// src/modules/academics/pages/ClassesAcademicPage.jsx
import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { ClassAcademicTable } from '../components/ClassAcademicTable'
import { StructureFormDialog } from '../components/StructureFormDialog'
import { academicService } from '../services/academicService'
import { LoadingState } from '@/components/common/LoadingState'

export function ClassesAcademicPage() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  const fetchClasses = async () => {
    setLoading(true)
    try {
      const list = await academicService.getAcademicClasses()
      setClasses(list)
    } catch (err) {
      console.error('Error fetching classes', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes Management"
        description="Class cohort rosters, assigned sections, student counts, and homeroom leads."
        actions={
          <Button size="sm" onClick={() => setOpen(true)} className="text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add class
          </Button>
        }
      />

      {loading ? <LoadingState message="Loading class cohorts..." /> : <ClassAcademicTable classes={classes} loading={loading} />}
      <StructureFormDialog kind="class" open={open} onOpenChange={setOpen} onCreated={fetchClasses} />
    </div>
  )
}
