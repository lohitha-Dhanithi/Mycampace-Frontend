// src/modules/academics/components/ClassTeacherTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { UserCheck, Plus, UserPlus } from 'lucide-react'
import { ClassTeacherForm } from './ClassTeacherForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function ClassTeacherTable({
  classTeachers = [],
  loading = false,
  onAssignClassTeacher,
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState(null)

  const handleOpenAssign = (row) => {
    setSelectedSection(row)
    setDialogOpen(true)
  }

  const columns = [
    {
      header: 'Class & Section',
      accessor: 'className',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900">{r.className}</span>
            <div className="text-[10px] text-slate-500 font-semibold">{r.sectionName}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Current Class Teacher',
      accessor: 'facultyName',
      sortable: true,
      cell: (r) => (
        <div>
          <span className="font-bold text-xs text-slate-800">{r.facultyName}</span>
          <div className="text-[10px] text-slate-400">{r.facultyEmail}</div>
        </div>
      ),
    },
    {
      header: 'Student Count',
      accessor: 'studentCount',
      cell: (r) => <span className="text-xs font-mono font-bold text-slate-700">{r.studentCount || 40} Students</span>,
    },
    {
      header: 'Effective Date',
      accessor: 'effectiveDate',
      cell: (r) => <span className="text-xs text-slate-500">{r.effectiveDate || '2026-06-01'}</span>,
    },
    {
      header: 'Campus',
      accessor: 'campusName',
      cell: (r) => <span className="text-xs text-slate-600">{r.campusName || 'Hyderabad Main'}</span>,
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
            onClick={() => handleOpenAssign(r)}
            className="h-7 text-xs px-2 text-blue-600"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" /> Reassign
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Homeroom Mentors & Class Teachers</h3>
          <p className="text-xs text-slate-500">
            Each section maintains exactly one active primary class educator responsible for student welfare and register management.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setSelectedSection(null)
            setDialogOpen(true)
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Assign Class Teacher
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={classTeachers}
        loading={loading}
        searchPlaceholder="Search by class, section, teacher..."
        emptyTitle="No class teacher assignments found"
        emptyDescription="Assign class teachers to homerooms."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedSection ? `Reassign Class Teacher: ${selectedSection.className} ${selectedSection.sectionName}` : 'Assign Class Teacher'}
            </DialogTitle>
          </DialogHeader>
          <ClassTeacherForm
            initialData={selectedSection}
            onSubmit={async (data) => {
              await onAssignClassTeacher(data)
              setDialogOpen(false)
            }}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
