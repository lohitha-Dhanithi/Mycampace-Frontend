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

  const [editingItem, setEditingItem] = useState(null)

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

  const handleEdit = (sub) => {
    setEditingItem(sub)
    setOpen(true)
  }

  const handleCreate = () => {
    setEditingItem(null)
    setOpen(true)
  }

  const handleToggleStatus = async (sub) => {
    const nextStatus = sub.status === 'Active' ? 'Inactive' : 'Active'
    await academicService.updateAcademicSubject(sub.id, { status: nextStatus })
    fetchSubjects()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subjects Management"
        description="Independent learning areas and academic units (e.g. Physics, Chemistry, Mathematics) mapped to courses and classes."
        actions={
          <Button size="sm" onClick={handleCreate} className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Subject
          </Button>
        }
      />

      {loading ? (
        <LoadingState message="Loading subjects catalog..." />
      ) : (
        <SubjectAcademicTable
          subjects={subjects}
          loading={loading}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      )}
      <StructureFormDialog
        kind="subject"
        open={open}
        initialData={editingItem}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) setEditingItem(null)
        }}
        onCreated={fetchSubjects}
      />
    </div>
  )
}
