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
  const [editingItem, setEditingItem] = useState(null)

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

  const handleEdit = (prog) => {
    setEditingItem(prog)
    setOpen(true)
  }

  const handleCreate = () => {
    setEditingItem(null)
    setOpen(true)
  }

  const handleToggleStatus = async (prog) => {
    const nextStatus = prog.status === 'Active' ? 'Inactive' : 'Active'
    await academicService.updateAcademicProgram(prog.id, { status: nextStatus })
    fetchPrograms()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Programs Management"
        description="Overall academic pathways, curriculum frameworks, durations, and qualification structures."
        actions={
          <Button size="sm" onClick={handleCreate} className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Program
          </Button>
        }
      />

      {loading ? (
        <LoadingState message="Loading operational academic programs..." />
      ) : (
        <ProgramAcademicTable
          programs={programs}
          loading={loading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      )}
      <StructureFormDialog
        kind="program"
        open={open}
        initialData={editingItem}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) setEditingItem(null)
        }}
        onCreated={fetchPrograms}
      />
    </div>
  )
}
