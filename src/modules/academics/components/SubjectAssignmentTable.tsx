// src/modules/academics/components/SubjectAssignmentTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Bookmark, UserPlus, Trash2, Edit, Plus } from 'lucide-react'
import { SubjectAssignmentForm } from './SubjectAssignmentForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

export function SubjectAssignmentTable({
  assignments = [],
  loading = false,
  onCreateAssignment,
  onUpdateAssignment,
  onRemoveAssignment,
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const handleOpenEdit = (item) => {
    setEditingAssignment(item)
    setDialogOpen(true)
  }

  const handleOpenDelete = (item) => {
    setDeleteTarget(item)
    setConfirmDeleteOpen(true)
  }

  const columns = [
    {
      header: 'Subject',
      accessor: 'subjectName',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900">{r.subjectName}</span>
            <div className="text-[10px] text-slate-400 font-mono">{r.subjectCode}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Class & Section',
      accessor: 'className',
      sortable: true,
      cell: (r) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800">{r.className}</span>
          <span className="text-slate-500 ml-1">({r.sectionName})</span>
        </div>
      ),
    },
    {
      header: 'Assigned Faculty Lead',
      accessor: 'facultyName',
      sortable: true,
      cell: (r) => (
        r.facultyName && r.facultyName !== 'Unassigned' ? (
          <span className="text-xs font-semibold text-slate-800">{r.facultyName}</span>
        ) : (
          <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Unassigned
          </span>
        )
      ),
    },
    {
      header: 'Credits',
      accessor: 'credits',
      cell: (r) => <span className="text-xs font-mono font-bold text-slate-700">{r.credits} Credits</span>,
    },
    {
      header: 'Weekly Hours',
      accessor: 'weeklyHours',
      cell: (r) => <span className="text-xs text-slate-600">{r.weeklyHours || 6} hrs/week</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenEdit(r)}
            className="h-7 text-xs px-2"
          >
            <Edit className="w-3.5 h-3.5 mr-1" /> Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDelete(r)}
            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Subject to Section Delivery Mapping</h3>
          <p className="text-xs text-slate-500">Allocate syllabus curriculum units to specific classroom cohorts.</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingAssignment(null)
            setDialogOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Assign Subject to Class
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={assignments}
        loading={loading}
        searchPlaceholder="Search subject assignments by subject or educator..."
        emptyTitle="No subject mappings found"
        emptyDescription="Assign curriculum subjects to active class sections."
      />

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAssignment ? 'Edit Subject Delivery Mapping' : 'Assign Subject to Class Section'}
            </DialogTitle>
          </DialogHeader>
          <SubjectAssignmentForm
            initialData={editingAssignment}
            onSubmit={async (data) => {
              if (editingAssignment) {
                await onUpdateAssignment(editingAssignment.id, data)
              } else {
                await onCreateAssignment(data)
              }
              setDialogOpen(false)
            }}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Remove Subject Assignment</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600">
              Are you sure you want to remove {deleteTarget.subjectName} from {deleteTarget.className} ({deleteTarget.sectionName})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onRemoveAssignment(deleteTarget.id)
                setConfirmDeleteOpen(false)
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      )}
    </>
  )
}
