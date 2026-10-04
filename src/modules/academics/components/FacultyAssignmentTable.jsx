// src/modules/academics/components/FacultyAssignmentTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { UserCheck, Trash2, Edit, Plus } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

export function FacultyAssignmentTable({
  assignments = [],
  loading = false,
  onRemoveAssignment,
  onCreateClick,
}) {
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const handleOpenDelete = (assignment) => {
    setSelectedAssignment(assignment)
    setConfirmDeleteOpen(true)
  }

  const columns = [
    {
      header: 'Faculty Educator',
      accessor: 'facultyName',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">{r.facultyName}</div>
            <div className="text-[10px] text-slate-400">{r.department}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Subject',
      accessor: 'subjectName',
      sortable: true,
      cell: (r) => (
        <div>
          <span className="font-semibold text-xs text-slate-800">{r.subjectName}</span>
          <div className="text-[10px] text-slate-400 font-mono">{r.subjectCode || 'SUB-001'}</div>
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
          <span className="text-slate-400 ml-1">({r.sectionName})</span>
        </div>
      ),
    },
    {
      header: 'Role / Type',
      accessor: 'assignmentType',
      sortable: true,
      cell: (r) => (
        <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          {r.assignmentType || 'Primary Teacher'}
        </span>
      ),
    },
    {
      header: 'Campus',
      accessor: 'campusName',
      cell: (r) => <span className="text-xs text-slate-600">{r.campusName || 'Hyderabad Main'}</span>,
    },
    {
      header: 'Academic Year',
      accessor: 'academicYearName',
      cell: (r) => <span className="text-xs font-mono text-slate-600">{r.academicYearName || '2026-2027'}</span>,
    },
    {
      header: 'Assigned Date',
      accessor: 'assignedDate',
      cell: (r) => <span className="text-xs text-slate-500">{r.assignedDate || '2026-06-01'}</span>,
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
          {r.status !== 'Removed' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenDelete(r)}
              className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              title="Remove Teaching Assignment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={assignments}
        loading={loading}
        searchPlaceholder="Search teaching assignments by faculty, subject, class..."
        emptyTitle="No faculty assignments found"
        emptyDescription="Create a faculty assignment to deploy educators to classes and subjects."
      />

      {/* Confirmation Dialog */}
      {selectedAssignment && (
        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Remove Teaching Assignment
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2 text-slate-600 text-xs">
              <p>
                Are you sure you want to remove the teaching assignment for{' '}
                <strong className="text-slate-900">{selectedAssignment.facultyName}</strong> teaching{' '}
                <strong className="text-slate-900">{selectedAssignment.subjectName}</strong> in{' '}
                <strong className="text-slate-900">{selectedAssignment.className} {selectedAssignment.sectionName}</strong>?
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                <strong>Compliance Note:</strong> The assignment will be marked as <em>Removed</em> in institutional activity logs and classroom rosters will reflect an unassigned subject lead.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onRemoveAssignment) onRemoveAssignment(selectedAssignment.id)
                setConfirmDeleteOpen(false)
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Removal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      )}
    </>
  )
}
