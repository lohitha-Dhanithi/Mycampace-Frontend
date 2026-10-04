// src/modules/academics/components/StudentEnrolmentTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Users, ArrowRightLeft, Eye, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SectionChangeDialog } from './SectionChangeDialog'

export function StudentEnrolmentTable({
  enrolments = [],
  loading = false,
  onChangeSectionConfirm,
}) {
  const navigate = useNavigate()
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [changeDialogOpen, setChangeDialogOpen] = useState(false)

  const handleOpenSectionChange = (item) => {
    setSelectedStudent(item)
    setChangeDialogOpen(true)
  }

  const columns = [
    {
      header: 'Student',
      accessor: 'studentName',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/students/${r.studentId}`)}
              className="font-bold text-xs text-slate-900 hover:text-blue-600 text-left transition-colors"
            >
              {r.studentName}
            </button>
            <div className="text-[10px] text-slate-400 font-mono">
              Roll: {r.rollNumber || '—'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Student ID',
      accessor: 'studentNumber',
      sortable: true,
      cell: (r) => <span className="font-mono text-xs font-bold text-blue-600">{r.studentNumber}</span>,
    },
    {
      header: 'Academic Year',
      accessor: 'academicYearName',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-600">{r.academicYearName}</span>,
    },
    {
      header: 'Program & Course',
      accessor: 'programName',
      cell: (r) => (
        <div className="text-xs max-w-[170px]">
          <span className="font-semibold text-slate-800 block truncate">{r.programName}</span>
          <span className="text-[10px] text-slate-400 block truncate">{r.courseName}</span>
        </div>
      ),
    },
    {
      header: 'Class',
      accessor: 'className',
      sortable: true,
      cell: (r) => <span className="text-xs font-semibold text-slate-800">{r.className}</span>,
    },
    {
      header: 'Section',
      accessor: 'sectionName',
      sortable: true,
      cell: (r) => (
        <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          {r.sectionName}
        </span>
      ),
    },
    {
      header: 'Campus',
      accessor: 'campusName',
      cell: (r) => <span className="text-xs text-slate-600">{r.campusName}</span>,
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
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenSectionChange(r)}
            className="h-7 text-xs px-2 text-indigo-700 hover:bg-indigo-50"
            title="Reallocate Section"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 mr-1" /> Change Section
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/students/${r.studentId}/academic`)}
            className="h-7 text-xs px-2 text-blue-600"
            title="View Academic Record in SIS"
          >
            <GraduationCap className="w-3.5 h-3.5 mr-1" /> Record
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={enrolments}
        loading={loading}
        searchPlaceholder="Search enrolments by student name, ID, class..."
        emptyTitle="No student enrolments found"
        emptyDescription="Student enrolments are synchronized with the Student Information System."
      />

      <SectionChangeDialog
        open={changeDialogOpen}
        onOpenChange={setChangeDialogOpen}
        student={selectedStudent}
        onConfirm={onChangeSectionConfirm}
      />
    </>
  )
}
