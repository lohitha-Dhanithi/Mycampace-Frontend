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
  const [editingItem, setEditingItem] = useState(null)

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

  const handleEdit = (cls) => {
    setEditingItem(cls)
    setOpen(true)
  }

  const handleCreate = () => {
    setEditingItem(null)
    setOpen(true)
  }

  const handleToggleStatus = async (cls) => {
    const nextStatus = cls.status === 'Active' ? 'Inactive' : 'Active'
    await academicService.updateAcademicClass(cls.id, { status: nextStatus })
    fetchClasses()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Classes Management"
        description="Academic levels and cohorts (e.g. Class 10, Class 12, Semester 1) referencing courses and academic pathways."
        actions={
          <Button size="sm" onClick={handleCreate} className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Class
          </Button>
        }
      />

      {loading ? (
        <LoadingState message="Loading class cohorts..." />
      ) : (
        <ClassAcademicTable
          classes={classes}
          loading={loading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      )}
      <StructureFormDialog
        kind="class"
        open={open}
        initialData={editingItem}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) setEditingItem(null)
        }}
        onCreated={fetchClasses}
      />
    </div>
  )
}
